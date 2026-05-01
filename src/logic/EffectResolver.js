import { TileTypes } from './BoardData.js';

export const EffectResolver = {
    resolve(tile, player) {
        if (!tile) return null;

        switch (tile.type) {
            case TileTypes.MUSHROOM:
                return { action: 'ADVANCE', steps: 4 };
            case TileTypes.COIN:
                return { action: 'COLLECT_COIN' };
            case TileTypes.FIRE_FLOWER:
                return { action: 'SELECT_RIVAL', type: 'FIRE_FLOWER' };
            case TileTypes.ICE_FLOWER:
                return { action: 'SELECT_RIVAL', type: 'ICE_FLOWER' };
            case TileTypes.WARP_PIPE_RED:
            case TileTypes.WARP_PIPE_GREEN:
                return { action: 'JUMP', targetIndex: tile.targetIndex - 1, sound: 'pipe' };
            case TileTypes.RED_STAR:
                return { action: 'FLY', targetIndex: 35 };
            case TileTypes.BULLET_BILL:
                return { action: 'BULLET_BILL', steps: 5 };
            case TileTypes.VICTORY:
                return { action: 'WIN' };
            default:
                return { action: 'NONE' };
        }
    }
};
