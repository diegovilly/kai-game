import { EventBus } from './EventBus.js';

export const GameState = {
    WAITING_FOR_DICE: 'WAITING_FOR_DICE',
    ROLLING: 'ROLLING',
    MOVING: 'MOVING',
    RESOLVING_TILE: 'RESOLVING_TILE',
    TURN_PAUSE: 'TURN_PAUSE',
    GAME_OVER: 'GAME_OVER'
};

export const StateManager = {
    currentState: GameState.WAITING_FOR_DICE,
    activePlayerIndex: 0,
    players: [],

    init(players) {
        this.players = players.map(p => ({
            ...p,
            coins: 0,
            status: 'Normal'
        }));
        this.activePlayerIndex = 0;
        this.currentState = GameState.WAITING_FOR_DICE;
        EventBus.emit('TURN_CHANGED', { activePlayer: this.getActivePlayer() });
    },

    getActivePlayer() {
        if (this.players.length === 0) return null;
        return this.players[this.activePlayerIndex];
    },

    setState(newState) {
        // Prevent state changes if game is over
        if (this.currentState === GameState.GAME_OVER) return;

        this.currentState = newState;
        
        // Notify UI about state changes to disable/enable dice
        if (newState === GameState.WAITING_FOR_DICE) {
            EventBus.emit('READY_TO_ROLL');
        } else {
            EventBus.emit('MOVEMENT_STARTED');
        }
    },

    nextTurn() {
        if (this.currentState === GameState.GAME_OVER) return;

        this.setState(GameState.TURN_PAUSE);
        
        setTimeout(() => {
            this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
            const activePlayer = this.getActivePlayer();
            
            // Skip turn if frozen
            if (activePlayer.status === 'Frozen') {
                activePlayer.status = 'Normal';
                EventBus.emit('STATUS_CHANGED', { player: activePlayer });
                // We need to wait another second before switching again for clarity
                this.nextTurn();
                return;
            }

            this.setState(GameState.WAITING_FOR_DICE);
            EventBus.emit('TURN_CHANGED', { activePlayer });
        }, 1000); // 1s delay
    },
    
    setGameOver(winner) {
        this.currentState = GameState.GAME_OVER;
        EventBus.emit('GAME_WON', { winner });
    }
};
