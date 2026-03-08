const multiplayerAvatarIds = [
  "fox",
  "red-panda",
  "bunny",
  "bear",
  "cat",
  "koala",
  "otter",
  "raccoon",
  "panda",
  "tiger",
  "lion",
  "owl",
  "penguin",
  "hedgehog",
  "frog",
  "duck",
  "hamster",
  "capybara",
  "llama",
  "elephant",
] as const;

export const getAvatarIdForKey = (key?: string | null) => {
  if (!key) return "fox";
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }
  return multiplayerAvatarIds[hash % multiplayerAvatarIds.length];
};
