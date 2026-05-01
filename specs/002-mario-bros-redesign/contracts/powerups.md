# Contract: Power-up Events

Communication between Phaser `GameScene` and Tailwind UI.

## Phaser -> UI (State Changes & Prompts)

### `SELECT_RIVAL_PROMPT`
Triggered when a player lands on Fire Flower or Ice Flower.
```json
{
  "type": "FIRE_FLOWER" | "ICE_FLOWER",
  "activePlayerId": 1,
  "candidates": [2, 4] // IDs of players that can be targeted
}
```

### `NEGATE_EFFECT_PROMPT`
Triggered when a player is about to be affected by a rival's attack.
```json
{
  "targetPlayerId": 2,
  "cost": 5,
  "effect": "PUSH_BACK" | "FREEZE"
}
```

## UI -> Phaser (Player Choices)

### `RIVAL_SELECTED`
Sent back when a user clicks a rival's name/icon in the overlay.
```json
{
  "targetPlayerId": 2
}
```

### `COIN_REDEMPTION_RESULT`
Sent back when a user chooses to spend coins or take the hit.
```json
{
  "playerId": 2,
  "redeemed": true | false
}
```
