import { ByteSet, NumberType } from "../../deps.ts";
import { Bitmap } from "../bitmap/Bitmap.ts";
import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { BMP } from "./BMP.ts";

export class Encoder {
    encode(bitmap: BitmapRGB): Uint8Array {
        const bitmapSize =
            (bitmap.width % 4 ? bitmap.width + (4 - (bitmap.width % 4)) : bitmap.width) *
            bitmap.height *
            3;
        // console.log("padding", padding);

        const offset = 2 + 4 + 2 + 2 + 4 + 40; // BM SIZE RES RES OFFSET HEADER
        let totalSize = offset;
        totalSize += bitmapSize; // pixels

        const bytes = new ByteSet(totalSize);
        bytes.write.string("BM"); // Bitmap Signature
        bytes.write.uint32(totalSize); // total size
        bytes.write.uint32(0); // reserved
        bytes.write.uint32(2 + 4 + 4 + 4 + 40); // offset for pixels
        bytes.write.uint32(40); // header size
        bytes.write.uint32(bitmap.width); // width
        bytes.write.uint32(bitmap.height); // height
        bytes.write.uint16(1); // cp (1)
        bytes.write.uint16(24); // bits per pixel
        bytes.write.uint32(0); // compression type
        bytes.write.uint32(bitmapSize); // image size
        bytes.write.uint32(0); // horizontal pixel per meter
        bytes.write.uint32(0); // vertical pixel per meter
        bytes.write.uint32(0); // number of colors in the color palette,
        bytes.write.uint32(0); // important colors

        for (let j = bitmap.height - 1; j >= 0; j--) {
            for (let i = 0; i < bitmap.width; i++) {
                bytes.write.uint8((bitmap.channel.blue.getPixel(i, j) * 255) | 0);
                bytes.write.uint8((bitmap.channel.green.getPixel(i, j) * 255) | 0);
                bytes.write.uint8((bitmap.channel.red.getPixel(i, j) * 255) | 0);
            }
            while ((offset + bytes.position) % 4) {
                bytes.write.uint8(0);
            }
        }

        return bytes.buffer;
    }
}
