<!-- 
SYNC IMPACT REPORT
Version change: 0.1.0 -> 1.0.0
List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Game Engine First (Phaser 3)
  - [PRINCIPLE_2_NAME] -> II. Fluid Animation Discipline
  - [PRINCIPLE_3_NAME] -> III. Componentized SoC (Separation of Concerns)
  - [PRINCIPLE_4_NAME] -> IV. Vercel-Ready CI/CD
  - [PRINCIPLE_5_NAME] -> V. Rule-Driven Board Logic
Added sections: Technology Stack & Performance, Development Workflow
Removed sections: None
Templates requiring updates: 
  ✅ updated: .specify/memory/constitution.md
  ✅ validated: .specify/templates/plan-template.md (aligns)
  ✅ validated: .specify/templates/spec-template.md (aligns)
  ✅ validated: .specify/templates/tasks-template.md (aligns)
Follow-up TODOs: None
-->

# Board Quest Constitution

## Core Principles

### I. Game Engine First (Phaser 3)
All game logic, rendering, and scene management MUST utilize Phaser 3. Use Phaser's built-in state management, camera system, and sprite handling as the primary source of truth for the game world. Rationale: Ensures optimal performance and leverages existing engine capabilities for "Game of the Goose" style mechanics.

### II. Fluid Animation Discipline
Character movement MUST be sequential (tile-by-tile) using Phaser Tweens. "Teleportation" between casillas is prohibited unless as a specific game mechanic (e.g., Bridge/Salto). Animations must remain synchronized with the spritesheet state (walking during movement, idle when stopped). Rationale: Core requirement for the "Board Quest" user experience.

### III. Componentized SoC (Separation of Concerns)
Maintain a strict separation between Phaser Game Objects (Player, GameScene), UI (Tailwind CSS), and Game Logic (DiceManager, BoardLogic). UI must communicate with the game core via structured events or singletons. Rationale: Facilitates "Vibe Coding" by keeping UI and Game Engine iterations decoupled.

### IV. Vercel-Ready CI/CD
The project MUST remain deployable to Vercel at all times. Use Vite for development and production build handling. Any feature addition or refactor must pass `npm run build` checks before being committed to the main/feature branch. Rationale: Enables rapid feedback loops and stakeholder previews.

### V. Rule-Driven Board Logic
Board casillas must have explicit types (Normal, Trap, Power-up, jumping) defined in a central `BoardLogic` configuration. Rule effects MUST be evaluated and processed immediately after character movement animations conclude. Rationale: Ensures deterministic and testable game rules.

## Technology Stack & Performance
- **Core Engine**: Phaser 3 (latest stable)
- **Build & Dev**: Vite (fast HMR)
- **Styling**: Tailwind CSS (for menus and overlays)
- **Hosting**: Vercel (GitHub integration)
- **Performance Target**: Initial page load under 2 seconds.

## Development Workflow
- **Vibe Coding Steps**: Follow the roadmap in `docs/kaigame.md` for iterative milestones.
- **Visual Verification**: Every UI or Game mechanic change must be verified in the browser before final task completion.
- **Branching**: Use feature branches for non-trivial logic changes.

## Governance
This constitution supersedes all other informal practices. Amendments require a version bump and updates to this file. All PRs and tasks must be reviewed against these core principles to ensure compliance.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
