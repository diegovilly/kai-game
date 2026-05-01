import Phaser from 'phaser';

// Singleton EventBus to allow Vue/Tailwind UI to communicate with Phaser
export const EventBus = new Phaser.Events.EventEmitter();
