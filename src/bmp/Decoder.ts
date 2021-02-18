import { ByteSet, NumberType } from "../../deps.ts";
import { Bitmap } from "../bitmap/Bitmap.ts";
import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { BMP } from "./BMP.ts";

export class Decoder {
    decode<T>(data: Uint8Array): T {
        if (!BMP.isValid(data)) {
            throw new Error(`Not a bmp image!`);
        }
        // Get bytes of image
        const bytes = ByteSet.from(data);

        bytes.read.string(2); // skip bm

        const fileSize = bytes.read.uint32();
        bytes.read.uint32(); // skip reserved

        const offset = bytes.read.uint32();
        console.log("off", offset);

        const headerSize = bytes.read.uint32();
        const width = bytes.read.int32();
        const height = bytes.read.int32();

        bytes.read.uint16(); // skip cp
        const bitsPerPixel = bytes.read.uint16();
        const compression = bytes.read.uint32();

        console.log("bpp", bitsPerPixel);
        console.log("w h", width, height);

        // Go to position
        bytes.position = offset;

        // const padding = Math.ceil((width * 3) / 8) * 8 - width * 3;
        const bitmap = new BitmapRGB(width, height);

        // console.log("padding", padding);

        for (let j = height - 1; j >= 0; j--) {
            for (let i = 0; i < width; i++) {
                bitmap.channel.blue.setPixel(i, j, bytes.read.uint8() / 255);
                bitmap.channel.green.setPixel(i, j, bytes.read.uint8() / 255);
                bitmap.channel.red.setPixel(i, j, bytes.read.uint8() / 255);
            }
            while ((offset + bytes.position) % 4) {
                bytes.read.uint8();
            }
        }

        /*console.log(bytes.read.uint8(), bytes.read.uint8(), bytes.read.uint8());
        console.log(bytes.read.uint8(), bytes.read.uint8(), bytes.read.uint8());
        console.log(bytes.read.uint8(), bytes.read.uint8(), bytes.read.uint8());
        console.log(bytes.read.uint8(), bytes.read.uint8(), bytes.read.uint8());*/

        return (bitmap as unknown) as T;
    }
}
