# Tasks: Mario Bros Redesign

Feature: Mario Bros Redesign  
Spec: [spec.md](spec.md)  
Plan: [plan.md](plan.md)

## Implementation Strategy

We will implement the redesign in phases, starting with asset preparation and foundational logic changes, followed by the visual overhaul, and finally the new gameplay mechanics.

## Phase 1: Setup

- [x] T001 [P] Prepare Mario-themed assets (background, characters, items) in `public/` directory
- [x] T002 [P] Update `src/logic/BoardData.js` to define the new `TileTypes` (MUSHROOM, COIN, FIRE_FLOWER, etc.)
- [x] T003 [P] Add Warp Pipe sound effects and Mario-themed sounds to `public/sounds` (implemented via SoundGen.js)

## Phase 2: Foundational

- [x] T004 [P] Refactor `src/logic/GameState.js` to track `coins` and `status` (Frozen) for each player
- [x] T005 [P] Update `src/logic/BoardData.js` to generate 60 tiles using the new spiral density logic
- [x] T006 Update `src/logic/EffectResolver.js` to handle new `TileTypes` and return corresponding actions

## Phase 3: [US1] Mario Universe Transformation

- [x] T007 [P] [US1] Update `src/scenes/Preloader.js` to load the new Mario assets
- [x] T008 [US1] Update `src/scenes/GameScene.js` to render the 60-tile board with Mario background
- [x] T009 [US1] Update player initialization in `src/scenes/GameScene.js` to use Mario character sprites
- [x] T010 [US1] Update board path drawing in `src/scenes/GameScene.js` to match the 60-tile layout

## Phase 4: [US2] Power-up Mechanics

- [x] T011 [US2] Implement Mushroom (+4) advance logic in `src/scenes/GameScene.js`
- [x] T012 [US2] Implement Coin (+1) collection logic and UI counter update
- [x] T013 [US2] Create Tailwind overlay for "Select Rival" (Fire/Ice Flower) in `index.html` and `src/main.js`
- [x] T014 [US2] Implement Fire Flower (-3 move to rival) logic in `src/scenes/GameScene.js`
- [x] T015 [US2] Implement Ice Flower (Freeze rival) logic in `src/scenes/GameScene.js` and `src/logic/GameState.js`
- [x] T016 [US2] Implement Coin Redemption prompt to block negative effects via Tailwind overlay

## Phase 5: [US3] Warp Pipe Teleportation

- [x] T017 [US3] Define Warp Pipe endpoint pairs in `src/logic/BoardData.js`
- [x] T018 [US3] Implement teleportation movement logic in `src/scenes/GameScene.js` with pipe entry/exit sound effects

## Phase 6: Polish

- [x] T019 [P] Fine-tune animation durations and eases for "Mario feel"
- [x] T020 [P] Verify responsiveness and performance (60 fps) across different viewport sizes
- [x] T021 Run `npm run build` to ensure project remains Vercel-ready

## Dependencies

- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 3
- Phase 5 depends on Phase 3
- Phase 6 depends on all previous phases

## Parallel Opportunities

- T001, T002, T003 can be done in parallel (Phase 1)
- T004, T005 can be started in parallel (Phase 2)
- Asset loading (T007) can be done while logic isBeing refactored (T004-T006)
