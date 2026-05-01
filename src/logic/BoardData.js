export const TileTypes = {
  NORMAL: 'NORMAL',
  MUSHROOM: 'MUSHROOM',
  COIN: 'COIN',
  FIRE_FLOWER: 'FIRE_FLOWER',
  ICE_FLOWER: 'ICE_FLOWER',
  WARP_PIPE_RED: 'WARP_PIPE_RED',
  WARP_PIPE_GREEN: 'WARP_PIPE_GREEN',
  RED_STAR: 'RED_STAR',
  BULLET_BILL: 'BULLET_BILL',
  VICTORY: 'VICTORY'
};

// Generates a 60-tile path for the Mario redesign
const generateBoard = () => {
    const tiles = [];
    
    // Define Warp Pipe connections
    const warpPipes = {
        RED: [15, 45],
        GREEN: [5, 25]
    };

    const createTile = (index, x, y) => {
        let type = TileTypes.NORMAL;
        let targetIndex = null;
        
        // Mario-themed special tiles distribution
        if (index === warpPipes.RED[0]) { type = TileTypes.WARP_PIPE_RED; targetIndex = warpPipes.RED[1]; }
        else if (index === warpPipes.RED[1]) { type = TileTypes.WARP_PIPE_RED; targetIndex = warpPipes.RED[0]; }
        else if (index === warpPipes.GREEN[0]) { type = TileTypes.WARP_PIPE_GREEN; targetIndex = warpPipes.GREEN[1]; }
        else if (index === warpPipes.GREEN[1]) { type = TileTypes.WARP_PIPE_GREEN; targetIndex = warpPipes.GREEN[0]; }
        else if ([8, 22, 38, 52].includes(index)) type = TileTypes.MUSHROOM;
        else if ([3, 12, 18, 30, 35, 42, 50, 58].includes(index)) type = TileTypes.COIN;
        else if ([14, 26, 33, 37, 48].includes(index)) type = TileTypes.FIRE_FLOWER;
        else if ([10, 13, 28, 31, 40, 55].includes(index)) type = TileTypes.ICE_FLOWER;
        else if (index === 19) type = TileTypes.RED_STAR;
        else if ([17, 34, 51].includes(index)) type = TileTypes.BULLET_BILL;
        else if (index === 60) type = TileTypes.VICTORY;
        
        return { index, x, y, type, targetIndex };
    };

    let x = 120;
    let y = 650;
    
    // First tile
    tiles.push(createTile(1, x, y));
    
    // Denser spiral for 60 tiles
    const segments = [
        { dx: 70, dy: 0, steps: 11 },   // Right (T2-T12)
        { dx: 0, dy: -70, steps: 8 },   // Up (T13-T20)
        { dx: -70, dy: 0, steps: 10 },  // Left (T21-T30)
        { dx: 0, dy: 70, steps: 6 },    // Down (T31-T36)
        { dx: 70, dy: 0, steps: 8 },    // Right (T37-T44)
        { dx: 0, dy: -70, steps: 4 },   // Up (T45-T48)
        { dx: -70, dy: 0, steps: 6 },   // Left (T49-T54)
        { dx: 0, dy: 70, steps: 2 },    // Down (T55-T56)
        { dx: 70, dy: 0, steps: 4 }     // Right (T57-T60)
    ];

    let tileId = 2;
    for (let seg of segments) {
        for (let i = 0; i < seg.steps; i++) {
            if (tileId > 60) break;
            x += seg.dx;
            y += seg.dy;
            tiles.push(createTile(tileId, x, y));
            tileId++;
        }
    }
    
    return tiles;
};

export const BoardData = generateBoard();
