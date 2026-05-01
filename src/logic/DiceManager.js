import { EventBus } from './EventBus.js';
import { StateManager, GameState } from './GameState.js';

export const DiceManager = {
    roll() {
        if (StateManager.currentState !== GameState.WAITING_FOR_DICE) return;

        StateManager.setState(GameState.ROLLING);
        
        // Simulate animation delay matching UI
        setTimeout(() => {
            const value = Math.floor(Math.random() * 6) + 1;
            EventBus.emit('DICE_ROLLED', { value, player: StateManager.getActivePlayer() });
            StateManager.setState(GameState.MOVING);
        }, 600); // 600ms roll animation match
    }
};
