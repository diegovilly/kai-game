# Data Model: Board Quest

## Entities

### Player
| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique ID (P1-P4) |
| `name` | String | Friendly name (e.g. Red Knight) |
| `currentTile` | Integer | Current position index (1-40) |
| `spriteKey` | String | Reference to spritesheet key |
| `isMoving` | Boolean | Lock state during tweening |
| `inventory` | Array | Placeholder for future power-ups |

### Tile
| Attribute | Type | Description |
| :--- | :--- | :--- |
| `index` | Integer | ID from 1 to 40 |
| `x` | Integer | Horizontal pixel coordinate |
| `y` | Integer | Vertical pixel coordinate |
| `type` | Enum | [Normal, Skull, Treasure, Bridge, Victory] |
| `targetIndex` | Integer | Optional destination for Bridge/Skull |

## State Machine: Turn Flow
1. `WAITING_FOR_DICE`: Active player must roll.
2. `ROLLING`: Dice animation in progress in UI.
3. `MOVING`: Player sprite traversing tiles in Phaser.
4. `RESOLVING_TILE`: Effect application (if any).
5. `TURN_PAUSE`: 1s delay before next player.
6. `NEXT_TURN`: Switch `activePlayer` index.
