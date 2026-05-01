# Feature Specification: Board Quest PoC

**Feature Branch**: `001-board-quest-poc`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "Project Board Quest (PoC) Game of the Goose style based on docs/kaigame.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Local Game Setup (Priority: P1)

As a group of local players, we want to choose our characters and see the board so that we can start a new game session.

**Why this priority**: It is the foundational step. Without board rendering and player initialization, no other gameplay is possible.

**Independent Test**: The application displays an initial selection menu (Tailwind). Upon selecting 1-4 players and characters, the game board scene (Phaser) renders with the sprites correctly initialized at Tile 1.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the user selects "2 Players" and picks characters, **Then** the game board renders and two sprites appear on the first tile.
2. **Given** the character selection screen, **When** no players are selected and start is clicked, **Then** an error message is displayed and the game does not start.

---

### User Story 2 - Basic Movement and Turn Control (Priority: P2)

As a player, I want to roll a dice and see my character move tile-by-tile along the board so that I can progress towards the finish.

**Why this priority**: Core gameplay loop. Represents the "Minimum Viable Gameplay" once the board is ready.

**Independent Test**: Can be tested by clicking the "Roll Dice" button; the active player's sprite moves the exact number of tiles shown on the dice using sequential animations (no jumping).

**Acceptance Scenarios**:

1. **Given** it is Player 1's turn, **When** Player 1 clicks "Roll Dice" and gets a 4, **Then** the Player 1 sprite moves through tiles 2, 3, 4, and stops at tile 5.
2. **Given** a player is currently moving along the path, **When** another player tries to roll the dice, **Then** the input is ignored until the current movement finishes.

---

### User Story 3 - Special Tile Interactions (Priority: P2)

As a player, I want to experience different effects (traps, power-ups) when landing on specific board tiles so that the game is dynamic and challenging.

**Why this priority**: Adds the "Goose Game" identity and balance. Without this, the game is just a race with no variety.

**Independent Test**: Landing on a "Skull" tile triggers a return to tile 1; landing on a "Chest" triggers an extra move of 3 tiles.

**Acceptance Scenarios**:

1. **Given** a player lands on Tile 24 (Skull), **When** their movement animation finishes, **Then** the sprite is moved back to Tile 1.
2. **Given** a player lands on a "Bridge" tile, **When** movement finishes, **Then** the sprite automatically moves to the designated exit tile of the bridge.

---

### User Story 4 - Winning Condition (Priority: P3)

As a player, I want to be notified when I reach the final tile so that I know I have won the game.

**Why this priority**: Provides closure to the game session.

**Independent Test**: Reaching or exceeding Tile 40 displays a "Winner" message and stops further turns.

**Acceptance Scenarios**:

1. **Given** a player is at Tile 38 and rolls a 3, **When** they reach Tile 40, **Then** the game displays "Player X Wins!" and the "Roll Dice" button is disabled.

---

### Edge Cases

- **Multiple players on the same tile**: Characters should have a visual offset so they don't perfectly overlap.
- **Roll exceeds Tile 40**: The player should stop exactly at Tile 40 and win (no "bouncing back" unless specified).
- **Interrupted connectivity (Session)**: For this PoC, refreshing the page resets the game (No persistence required).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support selection of 1 to 4 players from a set of available sprites.
- **FR-002**: Board MUST consist of exactly 40 tiles with predefined (x, y) coordinates for sprite positioning.
- **FR-003**: Dice mechanic MUST generate a random integer between 1 and 6 inclusive.
- **FR-004**: Movement MUST be sequential, traversing every intermediate tile between current and target positions.
- **FR-005**: Interaction with special tiles MUST occur ONLY after the sprite has reached the destination tile of the initial roll. Effects are NOT recursive; if a tile moves a player to another special tile, the second tile's effect does not trigger.
- **FR-006**: UI (Tailwind) MUST handle the dice roll trigger, the rolling animation (DOM-based), and display the result. Phaser core only receives the final value.
- **FR-007**: Turn transition MUST be automatic. The system switches to the next player after a brief pause following the completion of all movement and tile effects.

### Key Entities *(include if feature involves data)*

- **PlayerState**: Represents a player (id, sprite_key, current_tile_index, is_winner).
- **BoardMap**: Static data structure mapping tile index to (x, y) coordinates and `TileEffect`. Bridge/Jump effects MUST include a fixed `targetTileIndex`.
- **TileEffect**: Enum or Object defining behavior (Normal, Reset, Advance, Jump).

## Clarifications

### Session 2026-04-24
- Q: Do tile effects chain/trigger recursively? → A: No (Option A). Only the initial landing effect applies.
- Q: interface for character selection? → A: Dedicated Setup Screen (Option B) before board load.
- Q: How are bridge destinations defined? → A: Static mapping in board data (Option A).
- Q: Where is the dice animation rendered? → A: UI Layer (Option A), outside Phaser canvas.
- Q: How is the turn passed? → A: Automatic transition after a brief pause (Option A).


## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a full game (from start to finish) without application crashes or state lock-ups.
- **SC-002**: Initial board and character assets load in under 2 seconds on a standard 4G/Broadband connection.
- **SC-003**: Sprite movement animations remain fluid (target 60fps) during sequential tile traversal.
- **SC-004**: All rule-based tile effects (Traps/Power-ups) trigger correctly 100% of the time upon landing.

## Assumptions

- **Local Only**: Multiplayer is local-only (same machine, shared input). No online networking is in scope.
- **No Persistence**: Game state is lost on page refresh (Local Storage persistence is out of scope for PoC).
- **Asset Availability**: The required `board_map.png` and `players_spritesheet.png` will be provided or generated as per the PRD.
- **Fixed Board**: The board layout and coordinates are hardcoded for this version.
