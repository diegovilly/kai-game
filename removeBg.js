import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Jimp } from 'jimp';

async function processImage(inputPath, outputPath) {
    console.log(`Processing ${inputPath}...`);
    try {
        const image = await Jimp.read(inputPath);
        const targetColor = Jimp.rgbaToInt(255, 0, 255, 255);
        
        const colorDistance = (r1, g1, b1, r2, g2, b2) => {
            return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
        };

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            if(colorDistance(r, g, b, 255, 0, 255) < 70) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await image.writeAsync(outputPath);
        console.log(`Saved ${outputPath}`);
    } catch (e) {
        console.error(e);
    }
}

const run = async () => {
    const ids = ['knight', 'sorceress', 'ranger', 'bard'];
    const artifactFolder = '/Users/diego.villelga/.gemini/antigravity/brain/5f6a858f-b384-4c49-a61d-846867955373';
    
    const files = fs.readdirSync(artifactFolder);
    // Sort chronologically by timestamp
    const sorted = files.filter(f => f.startsWith('sprite_')).sort();
    
    for (let id of ids) {
        const matches = sorted.filter(f => f.startsWith(`sprite_${id}_`));
        if (matches.length > 0) {
            const latestFile = matches[matches.length - 1];
            await processImage(path.join(artifactFolder, latestFile), `./public/p${ids.indexOf(id)+1}_${id}.png`);
        }
    }
};

run();
