# Feature Specification: Mario Bros Redesign

**Feature Branch**: `002-mario-bros-redesign`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "Redesign the board game and the universe dedicated to Mario Bros. 60 tiles. Special tiles: Mushroom (+4), Coin (+1, 5 coins = cancel attack/retrogress), Fire Flower (rival -3), Ice Flower (rival freeze 1 turn), Red/Green Pipes (teleport). Keep current forward/backward sounds for pipes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mario Universe Transformation (Priority: P1)

As a player, I want to play in a board themed after the Mario Bros universe with 60 tiles so that I have a more immersive and longer gameplay experience.

**Why this priority**: Foundational redesign. Without the basic board and theme, other mechanics cannot be tested.

**Independent Test**: The game loads a 60-tile board with Mario Bros aesthetics and the player can move across all 60 tiles.

**Acceptance Scenarios**:

1. **Given** the game is started, **When** looking at the board, **Then** there are exactly 60 tiles visible.
2. **Given** a player is at tile 54 and rolls a 6, **When** they finish moving, **Then** they land on tile 60 and trigger the win condition.

---

### User Story 2 - Power-up Mechanics (Priority: P2)

As a player, I want to land on Mushroom, Coin, and Flower tiles to get advantages or affect my rivals.

**Why this priority**: Core gameplay variety requested by the user.

**Independent Test**: Landing on a Mushroom tile advances the player exactly 4 additional tiles. Landing on a Coin tile increments the coin counter.

**Acceptance Scenarios**:

1. **Given** a player lands on a Mushroom tile, **When** the movement finishes, **Then** the player immediately moves 4 tiles forward.
2. **Given** a player lands on a Coin tile, **When** the movement finishes, **Then** their coin total increases by 1.
3. **Given** a player has 5 coins, **When** they are hit by a Fire Flower or Ice Flower, **Then** they can choose to spend the coins to negate the effect.
4. **Given** a player lands on a Fire Flower, **When** they choose a rival ahead of them, **Then** that rival is moved 3 tiles back.
5. **Given** a player lands on an Ice Flower, **When** they choose a rival, **Then** that rival is frozen for their next turn.

---

### User Story 3 - Warp Pipe Teleportation (Priority: P2)

As a player, I want to enter a Warp Pipe and come out of another pipe of the same color to move across the board instantly.

**Why this priority**: Important movement mechanic requested.

**Independent Test**: Landing on a starting Red Pipe tile teleports the player to the destination Red Pipe tile with the appropriate sound effect.

**Acceptance Scenarios**:

1. **Given** a player lands on a Red Pipe entry, **When** the movement ends, **Then** the player is teleported to the corresponding Red Pipe exit with a sound effect.
2. **Given** a player lands on a Green Pipe entry, **When** the movement ends, **Then** the player is teleported to the corresponding Green Pipe exit with a sound effect.

---

### Edge Cases

- **Targeting rivals when no one is ahead**: If a Fire Flower is used and no rival is ahead, the player should be informed (or the tile should act as a normal tile).
- **Frozen player hit by another freeze**: The freeze effect should ideally not stack (or stack as specified - defaults to not stacking).
- **Teleporting to a pipe that then triggers another effect**: According to current rules (FR-005 in previous spec), effects are NOT recursive. Teleporting to a tile with another effect will not trigger the second effect.
- **Winning on a secondary move**: If a Mushroom move lands the player on or past tile 60, they win.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support a board layout with exactly 60 tiles.
- **FR-002**: Mushroom tiles MUST trigger an immediate 4-tile forward move upon landing.
- **FR-003**: Coin tiles MUST reward the player with 1 coin. 
- **FR-004**: Coin Redemption: If a player has exactly 5 coins or more, they MUST be prompted or given the option to cancel a negative effect (attack from rival or retrogress).
- **FR-005**: Fire Flower tiles MUST allow the player to select 1 rival ahead of them and push them back 3 tiles.
- **FR-006**: Ice Flower tiles MUST allow the player to select 1 rival and set their status to "Frozen" for 1 turn.
- **FR-007**: Red Warp Pipes MUST consist of two endpoint tiles. Landing on one teleports the player to the other.
- **FR-008**: Green Warp Pipes MUST consist of two endpoint tiles. Landing on one teleports the player to the other.
- **FR-009**: Warp Pipe sound effects MUST be maintained from the current implementation for forward/backward movement.

### Key Entities *(include if feature involves data)*

- **Player**: 
    - `id`: unique identifier
    - `coins`: integer (0-5+)
    - `isFrozen`: boolean (true if frozen for 1 turn)
    - `currentTile`: current position (1-60)
- **Board**: 
    - `tiles`: Array of 60 tile objects
- **Tile**:
    - `index`: 1-60
    - `type`: 'Normal', 'Mushroom', 'Coin', 'FireFlower', 'IceFlower', 'WarpPipeRed', 'WarpPipeGreen'
    - `targetIndex`: used for Warp Pipes or specific jumps

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of 60 tiles are navigable by players.
- **SC-002**: Mushroom advance effect triggers within 500ms of landing on tile.
- **SC-003**: Player can successfully cancel a negative effect using 5 coins in 100% of tested scenarios.
- **SC-004**: Warp pipe teleportation maintains the requested sound effects in 100% of cases.

## Assumptions

- **Selection UI**: The UI for selecting a rival for Fire/Ice Flower will be a Tailwind overlay.
- **Asset Availability**: Mario-themed sprites and board textures will be available or can be generated.
- **Fixed Pipe Pairs**: Red and Green pipes exist in exactly one pair each (one entry/exit pair per color).
- **Stacking Coins**: Coins can exceed 5, but only 5 are consumed for canceling an effect.
