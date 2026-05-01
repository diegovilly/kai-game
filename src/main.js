import './styles/style.css';
import Phaser from 'phaser';

import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import GameScene from './scenes/GameScene.js';
import { PlayerConfig, AVAILABLE_CHARACTERS } from './logic/PlayerConfig.js';
import { EventBus } from './logic/EventBus.js';
import { StateManager } from './logic/GameState.js';
import { DiceManager } from './logic/DiceManager.js';
import { SoundGen } from './logic/SoundGen.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1024,
    height: 768,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#87CEEB', // Sky blue for island background
    scene: [Boot, Preloader, GameScene]
};

// Initialize Game
const game = new Phaser.Game(config);

// Determine if we are heavily delayed by Vite DEV processing, and fade out loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.transition = 'opacity 0.5s ease';
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }, 200); // Short delay ensures tailwind styles are parsed and painted
});

// UI elements
const rollBtn = document.getElementById('roll-dice-btn');
const startGameBtn = document.getElementById('start-game-btn');
const charSelection = document.getElementById('character-selection');
const uiContainer = document.getElementById('ui-container');
const errorMsg = document.getElementById('selection-error');
const checkboxes = document.querySelectorAll('.player-checkbox');
const turnIndicator = document.getElementById('turn-indicator');
const currentPlayerName = document.getElementById('current-player-name');
const diceDisplay = document.getElementById('dice-display');
const lastRollVal = document.getElementById('last-roll-val');

startGameBtn.addEventListener('click', () => {
    const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selected.length === 0) {
        errorMsg.textContent = 'Please select at least one player.';
        return;
    }

    const playersInfo = selected.map(id => AVAILABLE_CHARACTERS.find(c => c.id === id));
    PlayerConfig.setPlayers(playersInfo);
    
    charSelection.style.display = 'none';
    uiContainer.classList.remove('hidden');

    StateManager.init(playersInfo);
    EventBus.emit('GAME_START', { players: StateManager.players });
});

let rollInterval;

rollBtn.addEventListener('click', () => {
    // Basic CSS animation for roll
    diceDisplay.classList.add('animate-spin', 'scale-110');
    
    // Scramble numbers rapidly to simulate rolling
    if (rollInterval) clearInterval(rollInterval);
    rollInterval = setInterval(() => {
        diceDisplay.textContent = Math.floor(Math.random() * 6) + 1;
        SoundGen.play('dice');
    }, 70);

    setTimeout(() => diceDisplay.classList.remove('animate-spin', 'scale-110'), 600);
    
    DiceManager.roll();
});

EventBus.on('TURN_CHANGED', ({ activePlayer }) => {
    turnIndicator.classList.remove('hidden');
    currentPlayerName.textContent = activePlayer.name;
    currentPlayerName.style.color = activePlayer.color;
    
    // Update image
    const spriteHud = document.getElementById('character-sprite-hud');
    if (spriteHud) {
        spriteHud.style.backgroundPosition = `calc(${activePlayer.frame} * 100% / 3) 0`;
        spriteHud.style.filter = activePlayer.status === 'Frozen' ? 'grayscale(1) brightness(0.7) sepia(1) hue-rotate(180deg)' : 'none';
    }
});

EventBus.on('READY_TO_ROLL', () => {
    rollBtn.disabled = false;
});

EventBus.on('MOVEMENT_STARTED', () => {
    rollBtn.disabled = true;
});

EventBus.on('GAME_START', (data) => {
    updatePlayerStatusList();
});

function updatePlayerStatusList() {
    const list = document.getElementById('player-status-list');
    if (!list) return;
    list.innerHTML = '';
    StateManager.players.forEach(p => {
        const div = document.createElement('div');
        div.className = `p-3 rounded-xl border-2 shadow-sm transition-all duration-500 flex gap-3 ${p.status === 'Frozen' ? 'opacity-60 grayscale bg-blue-900 border-blue-400' : 'bg-slate-800 border-slate-700'}`;
        div.innerHTML = `
            <div class="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden relative flex-shrink-0">
                <div class="absolute" style="background-image: url('/mario_characters.png'); background-size: 400% 100%; width: 100%; height: 100%; background-position: calc(${p.frame} * 100% / 3) 0;"></div>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-center">
                    <span class="font-black uppercase tracking-tighter text-lg" style="color: ${p.color}">${p.name}</span>
                    <span class="text-[10px] font-black ${p.status === 'Frozen' ? 'text-blue-300 animate-pulse' : 'text-slate-500'} uppercase">${p.status}</span>
                </div>
                <div class="flex items-center mt-1">
                    <span class="text-yellow-400 text-xl mr-2">💰</span>
                    <span class="font-black text-2xl text-yellow-500 tracking-tighter">${p.coins}</span>
                    <span class="ml-auto text-[10px] font-bold text-slate-500 uppercase">Tiles: ${p.currentIndex ?? 0}</span>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

EventBus.on('STATUS_CHANGED', updatePlayerStatusList);

EventBus.on('SELECT_RIVAL_PROMPT', ({ type, activePlayerId, candidates }) => {
    const overlay = document.getElementById('rival-selection');
    const title = document.getElementById('rival-title');
    const desc = document.getElementById('rival-desc');
    const list = document.getElementById('rival-list');
    
    title.textContent = type.replace('_', ' ');
    title.style.color = type === 'FIRE_FLOWER' ? '#ef4444' : '#60a5fa';
    desc.textContent = `Choose a rival to ${type === 'FIRE_FLOWER' ? 'push back 3 tiles' : 'freeze for 1 turn'}!`;
    list.innerHTML = '';
    
    candidates.forEach(cid => {
        const p = StateManager.players.find(p => p.id === cid);
        const btn = document.createElement('button');
        btn.className = "w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-2xl flex items-center justify-between px-6 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all group";
        btn.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden relative border border-slate-600 flex-shrink-0">
                    <div class="absolute" style="background-image: url('/mario_characters.png'); background-size: 400% 100%; width: 100%; height: 100%; background-position: calc(${p.frame} * 100% / 3) 0;"></div>
                </div>
                <span style="color: ${p.color}" class="text-xl uppercase tracking-tighter transition-transform group-hover:scale-110">${p.name}</span>
            </div>
            <span class="text-2xl">${type === 'FIRE_FLOWER' ? '🔥' : '❄️'}</span>
        `;
        btn.onclick = () => {
            overlay.classList.add('hidden');
            EventBus.emit('RIVAL_SELECTED', { targetPlayerId: cid });
        };
        list.appendChild(btn);
    });
    
    overlay.classList.remove('hidden');
});

EventBus.on('NEGATE_EFFECT_PROMPT', ({ targetPlayerId, cost, effect }) => {
    const overlay = document.getElementById('coin-redemption');
    const yesBtn = document.getElementById('redeem-yes');
    const noBtn = document.getElementById('redeem-no');
    
    yesBtn.onclick = () => {
        overlay.classList.add('hidden');
        EventBus.emit('COIN_REDEMPTION_RESULT', { playerId: targetPlayerId, redeemed: true });
    };
    
    noBtn.onclick = () => {
        overlay.classList.add('hidden');
        EventBus.emit('COIN_REDEMPTION_RESULT', { playerId: targetPlayerId, redeemed: false });
    };
    
    overlay.classList.remove('hidden');
});

EventBus.on('DICE_ROLLED', ({ value }) => {
    // Stop the scramble and show final value
    if (rollInterval) clearInterval(rollInterval);
    diceDisplay.textContent = value;
    lastRollVal.textContent = value;
});

const victoryOverlay = document.getElementById('victory-overlay');
const winnerText = document.getElementById('winner-text');
const restartBtn = document.getElementById('restart-game-btn');

EventBus.on('GAME_WON', ({ winner }) => {
    winnerText.textContent = `${winner.name} reaches the castle!`;
    winnerText.style.color = winner.color;
    victoryOverlay.classList.remove('hidden');
    rollBtn.disabled = true;
});

restartBtn.addEventListener('click', () => {
    window.location.reload();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        // Only trigger if the game has started and the button isn't disabled
        if (!uiContainer.classList.contains('hidden') && !rollBtn.disabled) {
            e.preventDefault(); // Prevent page scrolling
            rollBtn.click();
        }
    }
});
