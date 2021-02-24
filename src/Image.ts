import { ByteSet } from "../../bytearray/mod.ts";
import { ImageMagick, MagickImageFormat } from "../../imagick/mod.ts";
import { ColorSpace, ImageFormat } from "../mod.ts";
import { Bitmap } from "./birmap/Bitmap.ts";

export class Image {
    readonly bitmap: Bitmap;
    readonly format: ImageFormat;

    constructor({ bitmap, format = ImageFormat.RAW }: { bitmap: Bitmap; format?: ImageFormat }) {
        this.bitmap = bitmap;
        this.format = format;
    }

    get width() {
        return this.bitmap.width;
    }

    get height() {
        return this.bitmap.height;
    }

    async write(path: string) {
        const tempFile = (await Deno.makeTempFile()) + ".rgba";
        await Deno.writeFile(tempFile, this.bitmap.toBuffer());
        await ImageMagick.convert(tempFile, path, {
            size: `${this.width}x${this.height}`,
            depth: 8,
        });
        await Deno.remove(tempFile);
    }

    static async fromUrl(path: string) {
        // Get image raw buffer
        const buffer = ByteSet.from(
            await ImageMagick.convertToBuffer(path, MagickImageFormat.RGBA)
        );
        // Get image info
        const info = await ImageMagick.info(path);

        // Create bitmap
        const bitmap = new Bitmap(
            info.width,
            info.height,
            info.hasAlpha ? ColorSpace.RGBA : ColorSpace.RGB
        );

        let x = 0;
        let y = 0;
        for (let i = 0; i < buffer.length; i += 4) {
            const r = buffer.read.uint8() / 255;
            const g = buffer.read.uint8() / 255;
            const b = buffer.read.uint8() / 255;
            const a = buffer.read.uint8() / 255;

            bitmap.setPixel(x, y, {
                c0: r,
                c1: g,
                c2: b,
                c3: info.hasAlpha ? a : 1,
            });
            x++;
            if (x >= info.width) {
                x = 0;
                y++;
            }
        }

        let format = ImageFormat.Unknown;

        if (info.format === "jpeg") format = ImageFormat.JPEG;
        if (info.format === "png") format = ImageFormat.PNG;
        if (info.format === "gif") format = ImageFormat.GIF;
        if (info.format === "bmp" || info.format === "bmp3") format = ImageFormat.BMP;

        const image = new Image({ bitmap, format });

        return image;
    }

    static async info(path: string) {
        return await ImageMagick.info(path);
    }
}
