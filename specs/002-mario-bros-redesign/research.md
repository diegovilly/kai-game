# Research: Mario Bros Redesign

This document summarizes the technical decisions and asset strategies for the Mario Bros themed redesign.

## Asset Strategy

### Background
We generated a 1024x768 Mario world background (`mario_world_bg.png`). This will serve as the primary `board_map` texture in `Preloader.js`.

### Characters
We have a sheet with Mario, Luigi, Peach, and Yoshi (`mario_characters.png`). 
- **Decision**: For the PoC, we will manually define frames or use individual crops if needed.
- **Alternative**: Using generic placeholder colors was rejected to maintain high aesthetic standards.

### Special Tiles & Items
We have icons for Mushrooms, Coins, Fire/Ice Flowers, and Pipes (`mario_items.png`).
- **Decision**: These will be rendered as small icons on top of specific tiles in the `GameScene`.

## Board Layout (60 Tiles)

To fit 60 tiles in a 1024x768 canvas, we will use a denser spiral pattern.

- **Start**: (120, 650)
- **Path Logic**:
    - Segment 1: Right (+80px) 10 steps
    - Segment 2: Up (-80px) 7 steps
    - Segment 3: Left (-80px) 9 steps
    - Segment 4: Down (+80px) 5 steps
    - Segment 5: Right (+80px) 8 steps
    - Segment 6: Up (-80px) 3 steps
    - Segment 7: Left (-80px) 7 steps
    - Segment 8: Down (+80px) 1 step
    - Segment 9: Right (+80px) 5 steps
    - ... and so on until 60 tiles are placed.

## Special Tile Logic

### Mushroom (+4)
- **Implementation**: After normal movement finishes, check if `tile.type === 'MUSHROOM'`. If so, trigger `movePlayer(4)` with a different sound effect.

### Coins & Redemption
- **State**: `player.coins` will be tracked in `PlayerState`.
- **Redemption**: When a `FIRE_FLOWER` or `ICE_FLOWER` effect is triggered against a player, the `GameScene` will emit an event to the Tailwind UI. If `coins >= 5`, the UI shows a "BLOCK?" button.
- **Choice**: If blocked, consume 5 coins and skip the effect.

### Warp Pipes
- **Logic**: Static mapping in `BoardData`.
    - Red Pipe 1 <-> Red Pipe 2
    - Green Pipe 1 <-> Green Pipe 2
- **Effect**: Sequential move to the other pipe tile with "Pipe" sound effect.

## Sound Effects
- **Decision**: Keep current forward/backward sounds but perhaps rename them to `pipe_sound` for clarity.
