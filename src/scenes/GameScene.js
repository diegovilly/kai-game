import { Scene } from 'phaser';
import { EventBus } from '../logic/EventBus.js';
import { BoardData } from '../logic/BoardData.js';
import { StateManager } from '../logic/GameState.js';
import { EffectResolver } from '../logic/EffectResolver.js';
import { SoundGen } from '../logic/SoundGen.js';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
        this.players = [];
    }

    create() {
        const bg = this.add.image(512, 384, 'board_map');
        bg.setDisplaySize(1024, 768);
        bg.setAlpha(1); 
        
        this.drawBoardPath();

        EventBus.on('GAME_START', (data) => {
            this.initializePlayers(data.players);
        });

        EventBus.on('DICE_ROLLED', ({ value, player }) => {
            if (!player) return;
            const pData = this.players.find(p => p.info.id === player.id);
            if (pData) {
                this.movePlayer(pData, value);
            }
        });

        EventBus.on('STATUS_CHANGED', ({ player }) => {
            const pData = this.players.find(p => p.info.id === player.id);
            if (pData) {
                this.updatePlayerStatusVisuals(pData);
            }
        });
    }

    drawBoardPath() {
        // Draw a thick, translucent ribbon path under the tiles
        const pathGraphics = this.add.graphics();
        pathGraphics.lineStyle(18, 0xffffff, 0.2); 
        
        if (BoardData.length === 0) return;
        
        pathGraphics.beginPath();
        pathGraphics.moveTo(BoardData[0].x, BoardData[0].y);
        for (let i = 1; i < BoardData.length; i++) {
            pathGraphics.lineTo(BoardData[i].x, BoardData[i].y);
        }
        pathGraphics.strokePath();

        // Map TileTypes to item frames
        const typeToFrame = {
            'MUSHROOM': 0,
            'COIN': 1,
            'FIRE_FLOWER': 2,
            'ICE_FLOWER': 3,
            'WARP_PIPE_GREEN': 4,
            'WARP_PIPE_RED': 5,
            'RED_STAR': 0 // Use mushroom tinted red for star icon
        };

        // Draw each tile dynamically
        BoardData.forEach(tile => {
            let baseColor = 0xf8fafc; // Off-white/Light gray tile background
            let borderColor = 0x94a3b8;
            let iconFrame = typeToFrame[tile.type] ?? -1;
            
            // Special properties based on Tile logic
            if (tile.type === 'VICTORY') { 
                borderColor = 0xfacc15; 
                baseColor = 0xfef9c3; 
            }

            // 1. Drop Shadow
            this.add.circle(tile.x + 3, tile.y + 4, 24, 0x000000).setAlpha(0.2);
            
            // 2. Main Tile Circle
            const tileBg = this.add.circle(tile.x, tile.y, 18, baseColor);
            tileBg.setStrokeStyle(3, borderColor);
            tileBg.setAlpha(0.9);

            // 3. Tile Icons from Mario Items sheet
            if (tile.type === 'BULLET_BILL') {
                 const item = this.add.image(tile.x, tile.y, 'bullet_bill');
                 item.setDisplaySize(32, 32);
            } else if (iconFrame !== -1) {
                 const item = this.add.image(tile.x, tile.y, 'mario_items', iconFrame);
                 item.setDisplaySize(32, 32);
                 if (tile.type === 'RED_STAR') item.setTint(0xff0000);
            } else {
                 // Normal tile has prominent centralized number
                 this.add.text(tile.x, tile.y, tile.index.toString(), {
                     fontSize: '14px', color: '#64748b', fontFamily: 'Arial', fontStyle: 'bold'
                 }).setOrigin(0.5);
            }
        });
    }

    initializePlayers(playersInfo) {
        this.players.forEach(p => p.container.destroy());
        this.players = [];
        const startTile = BoardData[0];
        playersInfo.forEach((info, idx) => {
            const offsetX = (idx % 2 === 0 ? -16 : 16) * (idx < 2 ? 1 : -1);
            const offsetY = (idx < 2 ? -16 : 16);
            
            const container = this.add.container(startTile.x + offsetX, startTile.y + offsetY);
            
            // Use character-specific frame from processed spritesheet
            const sprite = this.add.sprite(0, 0, 'mario_characters', info.frame);
            sprite.setDisplaySize(60, 60); 
            sprite.setOrigin(0.5, 0.85);

            // Ice block effect
            const iceBlock = this.add.rectangle(0, -22, 60, 60, 0x00ccff, 0.4);
            iceBlock.setStrokeStyle(3, 0xffffff, 0.7);
            iceBlock.setVisible(false);
            
            container.add([sprite, iceBlock]);
            container.setDepth(100 + idx);
            
            this.players.push({
                info: info,
                container: container,
                sprite: sprite,
                iceBlock: iceBlock,
                targetOffset: { x: offsetX, y: offsetY },
                currentIndex: 0 
            });
        });
    }

    updatePlayerStatusVisuals(playerData) {
        if (playerData.info.status === 'Frozen') {
            playerData.iceBlock.setVisible(true);
            playerData.iceBlock.setScale(0);
            this.tweens.add({
                targets: playerData.iceBlock,
                scale: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });
            playerData.sprite.setTint(0xbbddff);
        } else {
            if (playerData.iceBlock.visible) {
                 this.tweens.add({
                    targets: playerData.iceBlock,
                    scale: 0,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        playerData.iceBlock.setVisible(false);
                        playerData.iceBlock.setAlpha(1);
                        playerData.iceBlock.setScale(1);
                    }
                });
            }
            playerData.sprite.clearTint();
        }
    }

    movePlayer(playerData, stepsTotal) {
        let currentStep = 0;
        
        const nextStep = () => {
            if (currentStep >= stepsTotal || playerData.currentIndex >= BoardData.length - 1) {
                // Movement finished. Assess tile effect.
                const landingTile = BoardData[playerData.currentIndex];
                EventBus.emit('TILE_LANDED', { tile: landingTile, player: playerData });
                
                const effect = EffectResolver.resolve(landingTile, playerData);
                this.executeEffect(playerData, effect);
                return;
            }

            playerData.currentIndex++;
            currentStep++;
            const targetTile = BoardData[playerData.currentIndex];

            this.tweens.add({
                targets: playerData.container,
                x: targetTile.x + playerData.targetOffset.x,
                y: targetTile.y + playerData.targetOffset.y,
                duration: 300,
                ease: 'Linear',
                onStart: () => {
                    SoundGen.play('step');
                },
                onComplete: () => {
                    nextStep();
                }
            });
        };

        nextStep();
    }

    executeEffect(playerData, effect) {
        if (!effect || effect.action === 'NONE') {
            StateManager.nextTurn();
            return;
        }

        if (effect.action === 'WIN') {
            SoundGen.play('win');
            this.createFireworks(playerData.container.x, playerData.container.y);
            setTimeout(() => {
                StateManager.setGameOver(playerData.info);
            }, 3000); 
            return;
        }

        if (effect.action === 'COLLECT_COIN') {
            playerData.info.coins += 1;
            EventBus.emit('STATUS_CHANGED', { player: playerData.info });
            SoundGen.play('coin'); 
            // Short delay for visual feedback before passing turn
            setTimeout(() => StateManager.nextTurn(), 500);
            return;
        }

        if (effect.action === 'SELECT_RIVAL') {
            SoundGen.play('powerup');
            const rivals = this.players
                .filter(p => p.info.id !== playerData.info.id)
                .map(p => p.info.id);
            
            if (rivals.length === 0) {
                StateManager.nextTurn();
                return;
            }

            EventBus.emit('SELECT_RIVAL_PROMPT', {
                type: effect.type,
                activePlayerId: playerData.info.id,
                candidates: rivals
            });

            EventBus.once('RIVAL_SELECTED', ({ targetPlayerId }) => {
                const targetPlayer = this.players.find(p => p.info.id === targetPlayerId);
                
                // Shoot particles from source to target and wait for them to hit
                this.shootParticles(playerData.container, targetPlayer.container, effect.type).then(() => {
                    // Check if target can block with coins
                    if (targetPlayer.info.coins >= 5) {
                        EventBus.emit('NEGATE_EFFECT_PROMPT', {
                            targetPlayerId: targetPlayerId,
                            cost: 5,
                            effect: effect.type === 'FIRE_FLOWER' ? 'PUSH_BACK' : 'FREEZE'
                        });

                        EventBus.once('COIN_REDEMPTION_RESULT', ({ playerId, redeemed }) => {
                            if (redeemed && playerId === targetPlayerId) {
                                targetPlayer.info.coins -= 5;
                                EventBus.emit('STATUS_CHANGED', { player: targetPlayer.info });
                                StateManager.nextTurn();
                            } else {
                                this.applyPowerUpEffect(targetPlayer, effect.type);
                            }
                        });
                    } else {
                        this.applyPowerUpEffect(targetPlayer, effect.type);
                    }
                });
            });
            return;
        }

        let targetIndex = playerData.currentIndex;
        
        if (effect.action === 'JUMP') {
            targetIndex = effect.targetIndex;
        } else if (effect.action === 'ADVANCE') {
            targetIndex = Math.min(playerData.currentIndex + effect.steps, BoardData.length - 1);
        } else if (effect.action === 'FLY') {
            this.flyPlayer(playerData, effect.targetIndex);
            return;
        } else if (effect.action === 'BULLET_BILL') {
            this.bulletBillPlayer(playerData, effect.steps);
            return;
        }

        const isAdvancing = targetIndex > playerData.currentIndex;
        playerData.currentIndex = targetIndex;
        const targetTile = BoardData[targetIndex];

        // Jump/teleport for effect execution
        this.tweens.add({
            targets: playerData.container,
            x: targetTile.x + playerData.targetOffset.x,
            y: targetTile.y + playerData.targetOffset.y,
            duration: 600,
            ease: 'Bounce.easeOut', 
            onStart: () => {
                const sound = effect.sound === 'pipe' ? 'pipe' : (isAdvancing ? 'powerup' : 'slide_down');
                SoundGen.play(sound);
            },
            onComplete: () => {
                this.checkLanding(playerData);
            }
        });
    }

    shootParticles(source, target, type) {
        return new Promise(resolve => {
            const isFire = type === 'FIRE_FLOWER';
            const color = isFire ? 0xff4500 : 0x00ccff;
            const particleCount = 16;
            let particlesHit = 0;
            
            // Play shooting sound
            SoundGen.play(isFire ? 'fireball' : 'iceball');

            for (let i = 0; i < particleCount; i++) {
                // Main projectile particle
                const p = this.add.circle(source.x, source.y - 30, 10, color);
                p.setDepth(200);
                
                // Add a glow effect with a second larger, more transparent circle
                const glow = this.add.circle(source.x, source.y - 30, 18, color);
                glow.setDepth(199);
                glow.setAlpha(0.3);
                
                const targetX = target.x + (Math.random() - 0.5) * 40;
                const targetY = target.y - 30 + (Math.random() - 0.5) * 40;

                const moveParams = {
                    x: targetX,
                    y: targetY,
                    scale: 0.5,
                    duration: 800,
                    delay: i * 45,
                    ease: 'Cubic.easeOut'
                };

                // Animate main particle
                this.tweens.add({
                    targets: p,
                    ...moveParams,
                    onComplete: () => {
                        // Impact effect
                        if (i % 4 === 0) SoundGen.play('impact');
                        
                        const flash = this.add.circle(p.x, p.y, 25, 0xffffff).setDepth(201);
                        this.tweens.add({ 
                            targets: flash, 
                            alpha: 0, 
                            scale: 2.5, 
                            duration: 150, 
                            onComplete: () => flash.destroy() 
                        });
                        
                        // Add some tiny impact fragments
                        for (let j = 0; j < 3; j++) {
                            const frag = this.add.circle(p.x, p.y, 4, color).setDepth(200);
                            this.tweens.add({
                                targets: frag,
                                x: frag.x + (Math.random() - 0.5) * 60,
                                y: frag.y + (Math.random() - 0.5) * 60,
                                alpha: 0,
                                duration: 300,
                                onComplete: () => frag.destroy()
                            });
                        }
                        
                        p.destroy();
                        particlesHit++;
                        if (particlesHit === particleCount) {
                            resolve();
                        }
                    }
                });

                // Animate glow particle with slight offset
                this.tweens.add({
                    targets: glow,
                    ...moveParams,
                    alpha: 0,
                    onComplete: () => glow.destroy()
                });
            }
        });
    }

    applyPowerUpEffect(targetPlayer, type) {
        if (type === 'FIRE_FLOWER') {
            const newIndex = Math.max(0, targetPlayer.currentIndex - 3);
            targetPlayer.currentIndex = newIndex;
            const targetTile = BoardData[newIndex];
            
            this.tweens.add({
                targets: targetPlayer.container,
                x: targetTile.x + targetPlayer.targetOffset.x,
                y: targetTile.y + targetPlayer.targetOffset.y,
                duration: 600,
                ease: 'Power2.easeOut',
                onStart: () => SoundGen.play('slide_down'),
                onComplete: () => StateManager.nextTurn()
            });
        } else if (type === 'ICE_FLOWER') {
            targetPlayer.info.status = 'Frozen';
            EventBus.emit('STATUS_CHANGED', { player: targetPlayer.info });
            StateManager.nextTurn();
        }
    }

    flyPlayer(playerData, targetIndex) {
        const startX = playerData.container.x;
        const startY = playerData.container.y;
        const targetTile = BoardData[targetIndex];
        const endX = targetTile.x + playerData.targetOffset.x;
        const endY = targetTile.y + playerData.targetOffset.y;
        
        playerData.currentIndex = targetIndex;

        // Flying trail particles
        const emitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            lifespan: 600,
            tint: 0xff3333,
            blendMode: 'ADD',
            quantity: 5,
            follow: playerData.container
        });

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 2000,
            ease: 'Power2.easeInOut',
            onStart: () => SoundGen.play('powerup'),
            onUpdate: (tween) => {
                const t = tween.getValue();
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;
                
                // Beautiful high arc
                const peak = 450;
                const jump = Math.sin(t * Math.PI) * peak;
                
                playerData.container.setPosition(x, y - jump);
                
                // Add some expressive rotation and scale
                playerData.container.setRotation(Math.sin(t * Math.PI * 2) * 0.3);
                playerData.container.setScale(1 + Math.sin(t * Math.PI) * 0.8);
            },
            onComplete: () => {
                emitter.stop();
                this.time.delayedCall(1000, () => emitter.destroy());
                
                // Reset visuals
                this.tweens.add({
                    targets: playerData.container,
                    rotation: 0,
                    scale: 1,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => this.checkLanding(playerData)
                });
            }
        });
    }

    bulletBillPlayer(playerData, steps) {
        const targetIndex = Math.min(playerData.currentIndex + steps, BoardData.length - 1);
        const targetTile = BoardData[targetIndex];
        const endX = targetTile.x + playerData.targetOffset.x;
        const endY = targetTile.y + playerData.targetOffset.y;
        
        playerData.currentIndex = targetIndex;

        // Change sprite to Bullet Bill
        const originalTexture = playerData.sprite.texture.key;
        const originalFrame = playerData.sprite.frame.name;
        playerData.sprite.setTexture('bullet_bill');
        playerData.sprite.setDisplaySize(80, 80);

        // Sound effect
        SoundGen.play('bullet_bill');

        // Determine direction to face Bullet Bill correctly (assuming right is default)
        const angle = Phaser.Math.Angle.Between(playerData.container.x, playerData.container.y, endX, endY);
        playerData.container.setRotation(angle);

        // Calculate distance for duration
        const distance = Phaser.Math.Distance.Between(playerData.container.x, playerData.container.y, endX, endY);
        const duration = Math.max(1000, distance * 5); // Slower animation

        this.tweens.add({
            targets: playerData.container,
            x: endX,
            y: endY,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                // Revert sprite
                playerData.container.setRotation(0);
                playerData.sprite.setTexture(originalTexture, originalFrame);
                playerData.sprite.setDisplaySize(60, 60);

                this.checkLanding(playerData);
            }
        });
    }

    checkLanding(playerData) {
        if (BoardData[playerData.currentIndex].type === 'VICTORY') {
            SoundGen.play('win');
            this.createFireworks(playerData.container.x, playerData.container.y);
            setTimeout(() => StateManager.setGameOver(playerData.info), 3000);
        } else {
            StateManager.nextTurn();
        }
    }

    createFireworks(x, y) {
        if (!this.textures.exists('particle')) {
            const g = this.make.graphics({x: 0, y: 0, add: false});
            g.fillStyle(0xffffff, 1);
            g.fillCircle(4, 4, 4);
            g.generateTexture('particle', 8, 8);
        }

        let count = 0;
        this.time.addEvent({
            delay: 400,
            repeat: 5,
            callback: () => {
                count++;
                const px = x + Phaser.Math.Between(-100, 100);
                const py = y + Phaser.Math.Between(-100, 50);
                const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
                
                const emitter = this.add.particles(px, py, 'particle', {
                    speed: { min: 100, max: 300 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 1, end: 0 },
                    lifespan: 1200,
                    tint: colors[count % colors.length],
                    gravityY: 150,
                    blendMode: 'ADD',
                    quantity: 40
                });
                
                this.time.delayedCall(150, () => {
                    emitter.stop();
                });
                this.time.delayedCall(1500, () => emitter.destroy());
            }
        });
    }
}



