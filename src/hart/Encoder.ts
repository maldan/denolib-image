import { ByteSet, NumberType } from "../../deps.ts";
import { Bitmap } from "../bitmap/Bitmap.ts";
import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { ColorRGB } from "../color/ColorRGB.ts";

export class Encoder {
    encode(bitmap: BitmapRGB): Uint8Array {
        // Count color
        let l = bitmap.countColors();
        const len = Math.min(l.length, 32);
        const blockSize = 16;

        // Calculate palette
        for (let i = 0; i < len; i++) {
            const color = l[i].color;
            for (let j = 0; j < 128; j++) {
                if (!l[j]) {
                    continue;
                }
                if (color === l[j].color) {
                    continue;
                }

                if (color.difference(l[j].color) < 0.1) {
                    l[i].frequency += l[j].frequency;
                    l.splice(j, 1);
                    j -= 1;
                }
            }
        }

        // Sort
        l = l.sort((a, b) => b.frequency - a.frequency);

        // Get first 16 colors
        const palette = l.slice(0, 16).map((x) => x.color);
        const paletteTable: { [x: number]: number } = {};
        palette.forEach((x, i) => (paletteTable[x.toNumber()] = i));

        // Replace pixels
        bitmap.each((c) => {
            return c.closest(palette);
        });

        // Block
        let blocks: { id: number; hash: number; block: ColorRGB[] }[] = [];
        bitmap.eachBlock(blockSize, (colors, id) => {
            let hash = 0;
            for (let i = 0; i < colors.length; i++) {
                hash += colors[i].toNumber() * i;
            }

            blocks.push({ id, hash, block: colors });
            return colors;
        });

        // Sort block
        blocks = blocks.sort((a, b) => a.hash - b.hash);

        // Replace block
        bitmap.eachBlock(blockSize, (colors, i) => {
            return blocks[i].block;
        });

        // Write data
        let totalLength = 2 + 4; // amount of block + resolution
        totalLength += 1 + palette.length * 3; // palette
        totalLength += blocks.length * 2; // block ids
        totalLength += blocks.length * (blockSize * blockSize); // block pixels

        const bytes = new ByteSet(totalLength);
        bytes.write.uint16(blocks.length); // amount of blocks
        bytes.write.uint16(bitmap.width); // image width
        bytes.write.uint16(bitmap.height); // image height
        bytes.write.uint8(palette.length); // palette size
        palette.forEach((x) => bytes.write.uint24(x.toNumber())); // palette
        blocks.forEach((x) => bytes.write.uint16(x.id)); // block ids

        // Write pixels
        blocks.forEach((x, i) => {
            x.block.forEach((y) => {
                bytes.write.uint8(paletteTable[y.toNumber()]);
            });
        });

        return bytes.buffer;
    }
}
