# Image Prompt Pack

## Recommended Model
- Use the strongest high-consistency commercial image model you have access to.
- In this environment I do not currently have image-generation credentials configured, so I cannot render these here yet.
- Best practical target for API workflow: OpenAI `gpt-image-1` with transparent background support and follow-up edits for consistency.

## Mascot Prompt V1
```text
A premium mobile game mascot character, cute smiling dachshund, long body, short legs, floppy ears, caramel chestnut fur with creamy muzzle and paws, expressive friendly eyes, soft rounded proportions, polished 3D illustration, toy-like but premium, subtle felt and glossy plastic material blend, clean silhouette, charming social word game energy, centered character, transparent background, no text, no props, no photorealism, no vector art, no harsh outlines
```

## Mascot Prompt V2
```text
A lovable dachshund mascot for a mass-market word puzzle mobile game, smiling, warm and relatable, big personality, long sausage-dog silhouette, soft caramel fur, cream snout, soft highlights, stylized 3D render, premium game-key-art quality, slightly oversized head, floppy ears, polished shading, transparent background, isolated subject, no background scene, no typography, no flat illustration, no realism
```

## Mascot Variants

### Wave
```text
The same approved smiling dachshund mascot in the exact same style and colors, waving hello with one paw lifted, happy welcoming expression, transparent background, polished 3D illustration, consistent character identity
```

### Celebrate
```text
The same approved smiling dachshund mascot in the exact same style and colors, excited celebration pose, confetti motion, joyful face, dynamic but readable silhouette, transparent background, polished 3D illustration, consistent character identity
```

## Logo Prompt
```text
Chunky 3D mobile game logo reading WORD!, playful glossy toy-letter styling, high-contrast readable shapes, warm orange coral yellow palette with cool blue shadow accents, premium app-store key art quality, transparent background, no extra text, no flat vector style
```

## Loading Screen Prompt 1
```text
Mobile game loading screen for a social word puzzle game called WORD!, premium 3D illustration, approved smiling dachshund mascot centered, floating glossy letter tiles, toy-like chips and sparks, bold family-friendly energy similar to classic card-game loading art, vivid blue coral gold palette, cinematic lighting, high polish, highly readable composition, vertical phone aspect ratio, no UI, no watermark
```

## Loading Screen Prompt 2
```text
Vertical loading artwork for WORD!, the approved dachshund mascot dashing through a cascade of glowing word tiles and colorful game pieces, premium 3D mobile game key art, playful competitive energy, broad-market appeal, glossy materials, rich depth, warm lighting, no watermark, no UI
```

## Loading Screen Prompt 3
```text
Vertical mobile loading art for WORD!, approved smiling dachshund mascot relaxing on oversized glossy letter blocks, cozy winning mood, premium 3D illustration, soft lighting, toy-like set dressing, bold but uncluttered composition, family-friendly mobile game style, no watermark, no UI
```

## Background Removal
- Generate on plain or minimal background when transparent output is not available
- Then remove background with a clean alpha mat
- Manually clean ears, paws, and tail edges after auto-matting

## Output Targets
- Mascot transparent assets: 2048x2048 PNG
- Loading screens: 1536x2732 PNG
- Logo transparent: 2048x2048 PNG
- Icon source: 1024x1024 PNG
