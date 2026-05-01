# Tasks: Board Quest PoC

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite project with `npx -y create-vite-app@latest ./`
- [x] T002 Install Phaser 3 and Tailwind CSS dependencies
- [x] T003 [P] Configure `tailwind.config.js` and `postcss.config.js`
- [x] T004 [P] Create directory structure: `src/scenes`, `src/logic`, `src/assets`, `src/styles`
- [x] T005 Setup basic `index.html` with Tailwind and Phaser container div

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement `src/logic/EventBus.js` using `Phaser.Events.EventEmitter`
- [x] T007 [P] Create `src/logic/BoardData.js` with 40-tile coordinate map and effect types
- [x] T008 [P] Implement `src/scenes/Boot.js` for initial configurations
- [x] T009 [P] Implement `src/scenes/Preloader.js` to load board and character assets
- [x] T010 Setup `src/main.js` to initialize the Phaser Game instance

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Local Game Setup (Priority: P1) 🎯 MVP

**Goal**: Allow players to choose characters and see the board

**Independent Test**: Landing on the app shows a character selection menu; choosing 2 players and clicking "Start" renders the board with 2 sprites on Tile 1.

### Implementation for User Story 1

- [x] T011 [US1] Create character selection UI in HTML/Tailwind in `index.html`
- [x] T012 [P] [US1] Implement `src/logic/PlayerConfig.js` to store selected character keys
- [x] T013 [US1] Update `src/scenes/GameScene.js` to render the `board_map` image
- [x] T014 [US1] Implement character instantiation logic in `src/scenes/GameScene.js` based on selection
- [x] T015 [US1] Add "GAME STATUS" sidebar layout in `index.html` with Tailwind glassmorphism

**Checkpoint**: User Story 1 is functional: Selection -> Board Load -> Players visible.

---

## Phase 4: User Story 2 - Basic Movement & Turn Control (Priority: P2)

**Goal**: Dice roll initiates sequential character movement

**Independent Test**: Clicking "Roll Dice" shows a number; the active player moves tile-by-tile the exact amount; turn shifts automatically after a pause.

### Implementation for User Story 2

- [x] T016 [US2] Implement Dice UI component and CSS roll animation in `index.html`
- [x] T017 [US2] Create `src/logic/DiceManager.js` to handle random math and EventBus notification
- [x] T018 [US2] Implement `movePlayer(steps)` sequential tween logic in `src/scenes/GameScene.js`
- [x] T019 [US2] Implement turn state management in `src/logic/GameState.js`
- [x] T020 [US2] Add automatic turn transition logic with 1s delay in `src/logic/GameState.js`
- [x] T021 [US2] Link UI "Roll Dice" button to `DiceManager.roll()` via EventBus

**Checkpoint**: Core gameplay loop active: roll -> move -> next turn.

---

## Phase 5: User Story 3 - Special Tile Interactions (Priority: P2)

**Goal**: Tiles like Skull and Bridge trigger their effects after movement

**Independent Test**: Landing on a Skull tile (index 24) sends the player back to Tile 1 using a jump animation.

### Implementation for User Story 3

- [x] T022 [US3] Implement `src/logic/EffectResolver.js` to evaluate `BoardData` effects
- [x] T023 [US3] Create `executeEffect()` handler in `src/scenes/GameScene.js` for Reset (Skull)
- [x] T024 [US3] Create `executeEffect()` handler in `src/scenes/GameScene.js` for Jump (Bridge)
- [x] T025 [US3] Create `executeEffect()` handler in `src/scenes/GameScene.js` for Advance (Chest)
- [x] T026 [US3] Integrate effect resolution into the movement completion callback in `GameScene.js`

**Checkpoint**: Special tiles now modify player positions as per rules.

---

## Phase 6: User Story 4 - Winning Condition (Priority: P3)

**Goal**: Notify when a player reaches the castle (Tile 40)

**Independent Test**: Reaching tile 40 stops the game and shows a "Player X Wins" modal.

### Implementation for User Story 4

- [x] T027 [US4] Implement win detection logic in `src/logic/GameState.js`
- [x] T028 [US4] Create "Victory" overlay in HTML/Tailwind in `index.html`
- [x] T029 [US4] Implement game reset/reload functionality in the Victory overlay

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Aesthetics and final touches

- [x] T030 [P] Implement character "walking" animation in `src/scenes/GameScene.js` using spritesheet frames
- [x] T031 [P] Add particle effects in Phaser for landing on a special tile
- [x] T032 [P] Refine Tailwind animations (hover effects, sidebar transitions)
- [x] T033 Final build verification with `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup** -> **Foundational** -> **User Story 1 (MVP)** -> **User Story 2** -> **User Story 3** -> **User Story 4** -> **Polish**

### Parallel Opportunities
- Board data mapping (T007) and Scene scaffolding (T008, T009) can run in parallel.
- Visual animations (T030) can be developed alongside gameplay logic if assets are ready.

---

## Implementation Strategy

### MVP First (Phases 1-3)
Focus on getting the board rendered and players selecting characters. This proves the Phaser-Tailwind integration.

### Incremental Movement
Once movement (Phase 4) is done, the game is "playable". Effects and Win conditions add the "fun" and "completeness".
