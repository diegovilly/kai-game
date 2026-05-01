# Research: Phaser 3 + Vite + Tailwind Integration

## Decision: Event-Driven Layered Architecture
### Rationale
To strictly follow Constitution Principle III (SoC), we need a bridge between the DOM (Tailwind) and the Canvas (Phaser). Using an externalized `EventEmitter` or a Global Store (if project grows) allows the Dice UI to signal the Game engine without tight coupling.

### Integration Details
1. **Phaser in Vite**: Use the `phaser` npm package. Game instance will be initialized in `main.js`.
2. **Tailwind Interaction**: Use `Game.events` or a custom singleton `EventBus` to notify `GameScene` when a roll is completed.
3. **Responsive Design**: Phaser canvas will have `PARENT` and `RESIZE` scale mode to fill its reserved DOM container (75% of screen).

## Decision: Sequential Tween Chaining
### Rationale
Constitution Principle II (No teleportation) requires moving through each tile. 
### Implementation
Use `Phaser.Tweens.timeline` (legacy) or a recursive `moveNext()` function that targets tile `n+1`, then `n+2`, until target is reached. This allows easier interruption and effect assessment.

## Decision: Static Coordinate Mapping
### Rationale
A 40-tile spiral is complex to calculate mathematically. A JSON map with `(x, y)` pairs per tile index is more robust for a PoC.
### Tile Effects
- `Normal`: Stop.
- `Trap`: Reset to Tile 1.
- `PowerUp`: Add `n` to current index and move again.
- `Jump`: Jump to specific index.

## Alternatives Considered
- **React-Phaser**: Overkill for this PoC. Vanilla JS + Tailwind is faster for "Vibe Coding".
- **Pure Canvas UI**: Violates Principle III and makes the sidebar harder to stylize with modern aesthetics (Glassmorphism).
