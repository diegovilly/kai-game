# Implementation Plan: Mario Bros Redesign

**Branch**: `002-mario-bros-redesign` | **Date**: 2026-04-26 | **Spec**: [specs/002-mario-bros-redesign/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-mario-bros-redesign/spec.md`

**Note**: This plan describes the redesign of KaiGame to a Mario Bros themed 60-tile board game with special power-ups and warp pipes.

## Summary

The project consists of expanding the board from 40 to 60 tiles and skinning it with Mario Bros assets. Key technical changes involve updating the `BoardData` to support 60 positions, implementing new logic for Mushroom, Coin, and Flower power-ups, and adding teleportation logic for Red and Green Warp Pipes. Rival selection for attacks will be handled via Tailwind CSS overlays communicating with Phaser.

## Technical Context

**Language/Version**: Javascript (ES6+)  
**Primary Dependencies**: Phaser 3, Tailwind CSS, Vite  
**Storage**: In-memory (Game state resets on refresh)  
**Testing**: Manual verification in browser  
**Target Platform**: Web (Vercel-ready)
**Project Type**: Web Application (Phaser Game)  
**Performance Goals**: 60 fps for animations  
**Constraints**: Sequential tile-by-tile movement (Constitution Principle II)  
**Scale/Scope**: 60 tiles, 1-4 players, 6 special tile types

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Alignment Strategy |
| :--- | :--- |
| **I. Game Engine First** | Phaser 3 will handle all new board tile rendering and player movement logic. |
| **II. Fluid Animation** | Movement (including Mushroom advance) remains tile-by-tile via Tweens. |
| **III. Componentized SoC** | Tailwind will handle the "Select Rival" UI for Fire/Ice flowers; Phaser core receives the result. |
| **IV. Vercel-Ready** | Vite build process targets Vercel. |
| **V. Rule-Driven Board Logic** | `BoardData.js` and `GameScene.js` will define the new tile effects deterministically. |

## Project Structure

### Documentation (this feature)

```text
specs/002-mario-bros-redesign/
├── plan.md              # This file
├── research.md          # Implementation decisions and asset strategy
├── data-model.md        # Updated Player and Tile data structures
├── quickstart.md        # How to run the new version
├── contracts/           # UI <-> Phaser events for power-ups
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── scenes/
│   ├── Boot.js          # Asset loading (Mario sprites)
│   └── GameScene.js     # Main gameplay loop and board rendering
├── logic/
│   ├── BoardData.js     # Tile positions and effects (60 tiles)
│   └── DiceManager.js   # Dice rolling logic
├── components/          # Tailwind UI components for HUD and Overlays
└── assets/              # Mario-themed images and sounds
```

**Structure Decision**: Single project structure using Phaser for game engine and Tailwind for UI overlays.

## Complexity Tracking

*No violations detected.*
