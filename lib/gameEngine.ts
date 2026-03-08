export type GameMode = "daily" | "practice";
export type GameStatus = "idle" | "active" | "won" | "lost";

export type WordEntry = {
  answer: string;
  clue: string;
  flavor: string;
  theme: string;
  maxAttempts: number;
};

export type GuessFeedback = {
  position: number;
  exactMatches: number;
  presentMatches: number;
  similarity: number;
  temperature: "cold" | "warm" | "hot" | "perfect";
  message: string;
};

export type GuessRecord = GuessFeedback & {
  id: string;
  word: string;
  createdAt: number;
};

export type GameSession = {
  mode: GameMode;
  puzzleId: string;
  answer: string;
  clue: string;
  flavor: string;
  theme: string;
  maxAttempts: number;
  guesses: GuessRecord[];
  status: GameStatus;
  startedAt: number;
  completedAt: number | null;
  lastMessage: string;
  score: number;
  bestPosition: number | null;
  guessCooldownMs: number;
  nextGuessAt: number | null;
};

export type SubmitGuessResult =
  | {
      ok: true;
      guess: GuessRecord;
      session: GameSession;
      isWin: boolean;
      isLoss: boolean;
    }
  | {
      ok: false;
      error: string;
    };

const WORD_BANK: WordEntry[] = [
  { answer: "EMBER", clue: "Warm glow left after the flames settle.", flavor: "A quiet spark survives the blaze.", theme: "Fire", maxAttempts: 6 },
  { answer: "TIDAL", clue: "Driven by the moon and never fully still.", flavor: "It pulls everything with patient force.", theme: "Ocean", maxAttempts: 6 },
  { answer: "BLOOM", clue: "A bright, short-lived burst from a plant.", flavor: "A soft explosion of color.", theme: "Garden", maxAttempts: 6 },
  { answer: "QUILL", clue: "Once used to write before steel pens took over.", flavor: "Sharp, feathered, and old-world precise.", theme: "Writing", maxAttempts: 7 },
  { answer: "GLINT", clue: "A tiny flash when light catches an edge.", flavor: "Brief, bright, and easy to miss.", theme: "Light", maxAttempts: 6 },
  { answer: "MIRTH", clue: "Joy with a bit of laughter in it.", flavor: "Lighter than happiness, louder than a smile.", theme: "Emotion", maxAttempts: 7 },
  { answer: "FROST", clue: "A thin white layer that arrives with hard cold.", flavor: "Beautiful until it bites.", theme: "Winter", maxAttempts: 6 },
  { answer: "SONIC", clue: "Related to sound moving with force.", flavor: "Fast enough to feel like impact.", theme: "Motion", maxAttempts: 7 },
  { answer: "LUNAR", clue: "Belonging to the night sky's nearest giant.", flavor: "Silver, distant, and rhythmic.", theme: "Space", maxAttempts: 6 },
  { answer: "CRISP", clue: "Fresh, snappy, and sharply defined.", flavor: "The sound of a clean break.", theme: "Texture", maxAttempts: 6 },
  { answer: "AURIC", clue: "Golden by origin or tone.", flavor: "Expensive-looking even in language.", theme: "Metal", maxAttempts: 7 },
  { answer: "VERVE", clue: "Energy with confidence and style.", flavor: "Charm in motion.", theme: "Performance", maxAttempts: 7 },
];

const PRACTICE_ROTATION = [...WORD_BANK].reverse();
export const GUESS_COOLDOWN_MS = 3000;

const normalizeWord = (value: string) => value.trim().toUpperCase();

export const isValidGuess = (value: string) => /^[A-Z]+$/.test(normalizeWord(value));

const scoreTemperature = (similarity: number): GuessFeedback["temperature"] => {
  if (similarity >= 1) return "perfect";
  if (similarity >= 0.72) return "hot";
  if (similarity >= 0.45) return "warm";
  return "cold";
};

const levenshteinDistance = (word1: string, word2: string) => {
  const matrix: number[][] = [];
  for (let index = 0; index <= word2.length; index += 1) {
    matrix[index] = [index];
  }
  for (let index = 0; index <= word1.length; index += 1) {
    matrix[0][index] = index;
  }
  for (let row = 1; row <= word2.length; row += 1) {
    for (let column = 1; column <= word1.length; column += 1) {
      if (word2[row - 1] === word1[column - 1]) {
        matrix[row][column] = matrix[row - 1][column - 1];
      } else {
        matrix[row][column] = Math.min(
          matrix[row - 1][column - 1] + 1,
          matrix[row][column - 1] + 1,
          matrix[row - 1][column] + 1
        );
      }
    }
  }
  return matrix[word2.length][word1.length];
};

const countCommonLetters = (word1: string, word2: string) => {
  const remaining = word2.split("");
  let count = 0;
  for (const letter of word1) {
    const matchIndex = remaining.indexOf(letter);
    if (matchIndex >= 0) {
      remaining.splice(matchIndex, 1);
      count += 1;
    }
  }
  return count;
};

const positionToSimilarity = (position: number) => {
  if (position <= 1) return 1;
  const scaled = Math.min(position, 10000) / 10000;
  return Math.max(0.08, 1 - Math.sqrt(scaled));
};

const calculatePosition = (answer: string, guess: string) => {
  const target = normalizeWord(answer);
  const probe = normalizeWord(guess);

  if (target === probe) {
    return 1;
  }

  const distance = levenshteinDistance(probe, target);
  const commonLetters = countCommonLetters(probe, target);
  const lengthDiff = Math.abs(probe.length - target.length);
  const score = distance * 100 - commonLetters * 30 + lengthDiff * 20;

  return Math.min(10000, Math.max(2, Math.floor(score)));
};

const buildMessage = (position: number, exactMatches: number, presentMatches: number, wordLength: number) => {
  if (position === 1) return "Perfect match.";
  if (position <= 10) return `Rank ${position}. You're almost on top of it.`;
  if (position <= 50) return `Rank ${position}. Very close.`;
  if (exactMatches >= wordLength - 1) return `Rank ${position}. One letter away.`;
  if (exactMatches >= 2) return `Rank ${position}. Strong structure.`;
  if (presentMatches >= 3) return `Rank ${position}. Good letters, wrong shape.`;
  if (position <= 500) return `Rank ${position}. You're getting warmer.`;
  return `Rank ${position}. Still far out.`;
};

export const evaluateGuess = (answer: string, rawGuess: string): GuessFeedback => {
  const target = normalizeWord(answer);
  const guess = normalizeWord(rawGuess);

  if (guess === target) {
    return {
      position: 1,
      exactMatches: target.length,
      presentMatches: target.length,
      similarity: 1,
      temperature: "perfect",
      message: "Perfect match.",
    };
  }

  const targetChars = target.split("");
  const guessChars = guess.split("");
  const usedTarget = new Array(target.length).fill(false);
  const usedGuess = new Array(guess.length).fill(false);

  let exactMatches = 0;
  for (let index = 0; index < Math.min(target.length, guess.length); index += 1) {
    if (targetChars[index] === guessChars[index]) {
      exactMatches += 1;
      usedTarget[index] = true;
      usedGuess[index] = true;
    }
  }

  let presentMatches = exactMatches;
  for (let guessIndex = 0; guessIndex < guessChars.length; guessIndex += 1) {
    if (usedGuess[guessIndex]) continue;
    const matchedTargetIndex = targetChars.findIndex(
      (char, targetIndex) => !usedTarget[targetIndex] && char === guessChars[guessIndex]
    );
    if (matchedTargetIndex >= 0) {
      usedTarget[matchedTargetIndex] = true;
      presentMatches += 1;
    }
  }

  const wordLength = target.length;
  const position = calculatePosition(target, guess);
  const positionRatio = exactMatches / wordLength;
  const letterRatio = presentMatches / wordLength;
  const lengthPenalty = Math.min(Math.abs(target.length - guess.length) * 0.08, 0.24);
  const structuralSimilarity = Math.max(
    0,
    Math.min(0.58 * positionRatio + 0.42 * letterRatio - lengthPenalty, 0.99)
  );
  const similarity = Math.max(structuralSimilarity, positionToSimilarity(position));

  return {
    position,
    exactMatches,
    presentMatches,
    similarity,
    temperature: scoreTemperature(similarity),
    message: buildMessage(position, exactMatches, presentMatches, wordLength),
  };
};

export const getDailyPuzzle = (dateKey: string) => {
  const numericSeed = Number(dateKey.replaceAll("-", ""));
  return WORD_BANK[numericSeed % WORD_BANK.length];
};

export const getPracticePuzzle = (seed: number) => {
  return PRACTICE_ROTATION[seed % PRACTICE_ROTATION.length];
};

const createSession = (mode: GameMode, puzzleId: string, puzzle: WordEntry, startedAt: number): GameSession => ({
  mode,
  puzzleId,
  answer: puzzle.answer,
  clue: puzzle.clue,
  flavor: puzzle.flavor,
  theme: puzzle.theme,
  maxAttempts: puzzle.maxAttempts,
  guesses: [],
  status: "active",
  startedAt,
  completedAt: null,
  lastMessage: "Start with a strong first guess.",
  score: 0,
  bestPosition: null,
  guessCooldownMs: GUESS_COOLDOWN_MS,
  nextGuessAt: null,
});

export const createDailySession = (dateKey: string, startedAt = Date.now()) =>
  createSession("daily", dateKey, getDailyPuzzle(dateKey), startedAt);

export const createPracticeSession = (seed: number, startedAt = Date.now()) =>
  createSession("practice", `practice-${seed}`, getPracticePuzzle(seed), startedAt);

export const calculateScore = (session: GameSession) => {
  const bestPosition = session.guesses.reduce(
    (best, guess) => Math.min(best, guess.position),
    10000
  );
  const attemptsUsed = Math.max(session.guesses.length, 1);
  const completionBonus = session.status === "won" ? 180 : 0;
  const positionScore = bestPosition === 10000 ? 0 : Math.max(0, 1100 - bestPosition);
  return Math.round(positionScore + completionBonus + Math.max(0, 80 - attemptsUsed * 6));
};

export const submitGuessToSession = (
  session: GameSession,
  rawGuess: string,
  timestamp = Date.now()
): SubmitGuessResult => {
  const cooldownWindow = Number.isFinite(session.guessCooldownMs)
    ? session.guessCooldownMs
    : GUESS_COOLDOWN_MS;
  const guess = normalizeWord(rawGuess);

  if (session.status !== "active") {
    return { ok: false, error: "This round is complete. Start a new one." };
  }

  if (session.nextGuessAt && timestamp < session.nextGuessAt) {
    const secondsRemaining = Math.max(1, Math.ceil((session.nextGuessAt - timestamp) / 1000));
    return { ok: false, error: `Wait ${secondsRemaining}s before the next guess.` };
  }

  if (!isValidGuess(guess)) {
    return { ok: false, error: "Use letters only." };
  }

  if (guess.length !== session.answer.length) {
    return { ok: false, error: `Use a ${session.answer.length}-letter word.` };
  }

  if (session.guesses.some((entry) => entry.word === guess)) {
    return { ok: false, error: "You already tried that word." };
  }

  const feedback = evaluateGuess(session.answer, guess);
  const guessRecord: GuessRecord = {
    id: `${session.mode}-${timestamp}`,
    word: guess,
    createdAt: timestamp,
    ...feedback,
  };

  const nextGuesses = [guessRecord, ...session.guesses];
  const didWin = feedback.position === 1;
  const nextStatus: GameStatus = didWin ? "won" : "active";
  const currentBestPosition =
    session.bestPosition ??
    session.guesses.reduce((best, entry) => Math.min(best, entry.position), Number.POSITIVE_INFINITY);
  const bestPosition =
    currentBestPosition === Number.POSITIVE_INFINITY
      ? feedback.position
      : Math.min(currentBestPosition, feedback.position);
  const nextSession: GameSession = {
    ...session,
    guesses: nextGuesses,
    status: nextStatus,
    completedAt: nextStatus === "active" ? null : timestamp,
    bestPosition,
    guessCooldownMs: cooldownWindow,
    nextGuessAt: nextStatus === "active" ? timestamp + cooldownWindow : null,
    lastMessage: didWin
      ? "Round cleared. Clean finish."
      : feedback.message,
  };

  nextSession.score = calculateScore(nextSession);

  return {
    ok: true,
    guess: guessRecord,
    session: nextSession,
    isWin: didWin,
    isLoss: false,
  };
};

export const formatDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
