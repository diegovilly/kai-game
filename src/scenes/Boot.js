import { Scene } from 'phaser';

export default class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load anything needed for the preloader itself here, like a splash or loading bar
    }

    create() {
        this.scene.start('Preloader');
    }
}
