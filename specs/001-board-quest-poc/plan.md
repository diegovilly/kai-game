# Implementation Plan: Board Quest PoC

Implementation plan for the initial PoC of Board Quest, based on the `spec.md` and project constitution.

## User Review Required

> [!IMPORTANT]
> The design will strictly follow the layout in `docs/web.png`, including the "GAME STATUS" sidebar and the spiraling island board.
> Phaser 3 will be used for the board and sprites, while Tailwind CSS will handle the UI sidebar and overlays.

---

## Proposed Changes

### [Phase 0] Infrastructure & Scaffolding

#### [NEW] [research.md](file:///Users/diego.villelga/Documents/DEV-AI/KaiGame/specs/001-board-quest-poc/research.md)
Documenting Phaser 3 + Vite integration and best practices for Tailwind overlays.

- Setup Vite project with Phaser 3 template.
- Initialize Tailwind CSS configuration.
- Define Asset loading strategy (Preloader scene).

### [Phase 1] Core Logic & Data Model

#### [NEW] [data-model.md](file:///Users/diego.villelga/Documents/DEV-AI/KaiGame/specs/001-board-quest-poc/data-model.md)
Define internal states for `PlayerState`, `BoardMap` (40 tiles), and `TileEffects`.

- **BoardMap**: JSON-like structure mapping tile ID (1-40) to `x, y` positions and effect type.
- **PlayerState**: Track index, turn order, and animation status.

#### [NEW] [contracts/events.md](file:///Users/diego.villelga/Documents/DEV-AI/KaiGame/specs/001-board-quest-poc/contracts/events.md)
Define the communication contract between Tailwind UI and Phaser Scene (e.g., `START_GAME`, `ROLL_DICE`, `TURN_COMPLETED`).

### [Phase 2] Implementation - MVP Layout

#### [NEW] `index.html`, `src/main.js`, `src/style.css`
Foundation of the web app with Tailwind integration.

- Create the split-screen layout: Sidebar (25%) and Game Canvas (75%).
- Implement glassmorphism styles for the "GAME STATUS" panel.

#### [NEW] `src/scenes/BootScene.js`, `src/scenes/Preloader.js`
Handle asset loading and system initialization.

#### [NEW] `src/scenes/GameScene.js`
Main Phaser scene.
- Render board background.
- Initialize Player sprites.
- Implement `movePlayer(steps)` logic with sequential tweens.

#### [NEW] `src/logic/DiceManager.js`
Logic for random roll and coordination with the Tailwind UI button.

---

## Constitution Check

| Principle | Alignment Strategy |
| :--- | :--- |
| **I. Game Engine First** | Phaser 3 is central to `GameScene` and character rendering. |
| **II. Fluid Animation** | Movement uses sequential `tweens` chain in `Player.js`. |
| **III. Componentized SoC** | Tailwind handles UI sidebar; Phaser handles the board. |
| **IV. Vercel-Ready** | Project uses Vite and is configured for one-click Vercel deployment. |
| **V. Rule-Driven Logic** | `BoardLogic` defines all effects (Trap/Bridge) in a static map. |

---

## Open Questions

- [x] **Character Selection**: Will be handled via a Tailwind overlay before Phaser starts (Resolved in Clarifications).
- [x] **Dice Animation**: Will be a DOM/CSS animation in the sidebar (Resolved in Clarifications).

---

## Verification Plan

### Automated Tests
- For this PoC, focus is on manual verification. Unit tests for `DiceManager` and `BoardLogic` can be added if requested.

### Manual Verification
- **Test 1**: Verify 1-4 players can be selected in the menu.
- **Test 2**: Verify sequential movement (no teleport) for a roll of 6.
- **Test 3**: Verify "Skull" tile resets position correctly.
- **Test 4**: Verify winning message displays exactly at Tile 40.
