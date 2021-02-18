import { ByteSet, NumberType } from "../../deps.ts";
import { Bitmap } from "../bitmap/Bitmap.ts";
import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { ColorRGB } from "../color/ColorRGB.ts";

export class Decoder {
    decode(data: Uint8Array): BitmapRGB {
        const bytes = ByteSet.from(data);

        const blockAmount = bytes.read.uint16();
        const width = bytes.read.uint16();
        const height = bytes.read.uint16();
        const paletteAmount = bytes.read.uint8();
        const paletteTable: ColorRGB[] = [];
        const blockSize = 16;

        // Read palette
        bytes.read.each(
            NumberType.Uint24,
            (x) => {
                paletteTable.push(new ColorRGB({ hex: x }));
            },
            paletteAmount
        );

        const blockIds: number[] = [];
        const blocks: ColorRGB[][] = [];
        const blockMap: number[] = [];

        const bitmap = new BitmapRGB(width, height);

        // Read block ids
        bytes.read.each(
            NumberType.Uint16,
            (x) => {
                blockIds.push(x);
            },
            blockAmount
        );

        blockIds.map((x, i) => {
            blockMap[x] = i;
        });

        // Read blocks
        let tempBlock: ColorRGB[] = [];
        bytes.read.each(NumberType.Uint8, (x, i) => {
            tempBlock.push(paletteTable[x]);
            if ((i + 1) % (blockSize * blockSize) === 0) {
                blocks.push(tempBlock);
                tempBlock = [];
            }
        });

        // Replace block
        bitmap.eachBlock(blockSize, (colors, i) => {
            // return blocks[blockMap[i]];
            return blocks[i];
        });

        return bitmap;
    }
}
