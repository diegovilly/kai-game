import { Scene } from 'phaser';

export default class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Load spectacular Mario world background
        this.load.image('board_map', '/mario_bg.png');
        
        // Load Mario characters spritesheet
        // New processed dimensions: 1019x497, 4 frames
        this.load.spritesheet('mario_characters', '/mario_characters.png', {
            frameWidth: 254, 
            frameHeight: 497
        });

        // Load item icons for special tiles
        // New processed dimensions: 1000x157, 6 frames
        this.load.spritesheet('mario_items', '/mario_items.png', {
            frameWidth: 166, 
            frameHeight: 157
        });

        // Load Bullet Bill
        this.load.svg('bullet_bill', '/bullet_bill.svg', { width: 100, height: 100 });
    }

    create() {
        this.scene.start('GameScene');
    }
}
