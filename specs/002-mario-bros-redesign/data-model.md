# Data Model: Mario Bros Redesign

## Updated PlayerState

Represents the state of a player in the 60-tile Mario world.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | number | Player index (1-4) |
| `sprite_key` | string | Key for the player's character sprite (mario, luigi, etc) |
| `current_tile` | number | Position on board (1-60) |
| `coins` | number | Number of coins collected |
| `status` | string | 'Normal' or 'Frozen' |
| `is_winner` | boolean | Set to true when reaching Tile 60 |

## Updated Tile Definitions

| Type | Target | Effect |
| :--- | :--- | :--- |
| `NORMAL` | null | No effect |
| `MUSHROOM` | +4 | Advance 4 additional tiles |
| `COIN` | +1 | Recieve 1 gold coin |
| `FIRE_FLOWER` | rival | Select rival ahead to push back 3 tiles |
| `ICE_FLOWER` | rival | Select rival to freeze for 1 turn |
| `WARP_PIPE_RED` | fixed | Teleport to the other Red Pipe endpoint |
| `WARP_PIPE_GREEN` | fixed | Teleport to the other Green Pipe endpoint |
| `VICTORY` | null | End game |

## Board Map (60 tiles)

The `BoardData` will contain an array of 60 tiles with:
- `index`: 1-60
- `x, y`: Screen coordinates
- `type`: One of the above
- `targetIndex`: For Warp Pipes or fixed jumps
