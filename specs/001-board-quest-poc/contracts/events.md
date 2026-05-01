# Communication Contract: UI <-> Game Engine

All communication happens via a shared `EventBus` (Phaser.Events.EventEmitter).

## UI -> Game Scene
| Event | Payload | Description |
| :--- | :--- | :--- |
| `GAME_START` | `{ players: [] }` | Sent by Tailwind menu to initialize Phaser characters. |
| `DICE_ROLLED` | `{ value: int }` | Sent after Tailwind dice animation finishes. |

## Game Scene -> UI
| Event | Payload | Description |
| :--- | :--- | :--- |
| `MOVEMENT_STARTED` | `null` | UI should disable the "Roll Dice" button. |
| `TILE_LANDED` | `{ tileType, player }` | UI can show a notification or sound effect. |
| `TURN_CHANGED` | `{ activePlayer }` | UI updates the "Current Turn" panel. |
| `GAME_WON` | `{ winner }` | UI shows the winner overlay. |
