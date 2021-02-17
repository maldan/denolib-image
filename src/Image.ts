import { ByteSet } from "../../bytearray/mod.ts";
import { Bitmap } from "./bitmap/Bitmap.ts";
import { BitmapRGB } from "./bitmap/BitmapRGB.ts";
import { BitmapRGBA } from "./bitmap/BitmapRGBA.ts";
import { BMP } from "./bmp/BMP.ts";
import { ColorSpace } from "./color/Color.ts";
// deno-lint-ignore camelcase
import { Decoder_BMP } from "./decode/Decoder_BMP.ts";
// deno-lint-ignore camelcase
import { Decoder_GIF } from "./decode/Decoder_GIF.ts";
// deno-lint-ignore camelcase
import { Decoder_PNG } from "./decode/Decoder_PNG.ts";
import { JPEG } from "./jpeg/JPEG.ts";

export enum ImageType {
    None = "none",
    JPEG = "jpeg",
    PNG = "png",
    BMP = "bmp",
    GIF = "gif",
}

export class Image<T> {
    //private _buffer: Uint8Array;
    readonly bitmap: T;

    constructor(image: T) {
        this.bitmap = image;
        /*this._buffer = image;

        if (this.type === ImageType.JPEG) {
            JPEG.decode(image);
        }*/
    }

    /*get type() {
        const data = this._buffer;
        if (JPEG.isValid(data)) return ImageType.JPEG;
        if (Decoder_PNG.isValid(data)) return ImageType.PNG;
        if (Decoder_GIF.isValid(data)) return ImageType.GIF;
        if (Decoder_BMP.isValid(data)) return ImageType.BMP;
        return ImageType.None;
    }*/

    to(type: ImageType): Uint8Array {
        if (type === ImageType.BMP) {
            return BMP.encode((this.bitmap as unknown) as BitmapRGB);
        }
        throw new Error("Unsupported type");
    }

    async write(path: string, as: ImageType) {
        await Deno.writeFile(path, this.to(as));
    }

    static async from<T>(path: string): Promise<Image<T>> {
        const data = await Deno.readFile(path);
        if (BMP.isValid(data)) {
            return new Image<T>(BMP.decode<T>(data));
        }
        throw new Error("Unsupported format");
    }

    static async fromRaw(
        path: string,
        width: number,
        height: number,
        colorSpace: ColorSpace.RGB
    ): Promise<Image<BitmapRGB>>;
    static async fromRaw(
        path: string,
        width: number,
        height: number,
        colorSpace: ColorSpace.RGBA
    ): Promise<Image<BitmapRGBA>>;
    static async fromRaw(
        path: string,
        width: number,
        height: number,
        colorSpace: ColorSpace
    ): Promise<Image<BitmapRGBA | BitmapRGB>> {
        const data = await Deno.readFile(path);
        const b = ByteSet.from(data);
        const bitmap = new BitmapRGB(width, height);

        let x = 0;
        let y = 0;

        for (let i = 0; i < b.length; i += 3) {
            bitmap.setPixel(x, y, {
                r: b.read.uint8() / 255,
                g: b.read.uint8() / 255,
                b: b.read.uint8() / 255,
            });
            x++;
            if (x >= width) {
                x = 0;
                y++;
            }
        }

        if (colorSpace === ColorSpace.RGBA) return new Image(bitmap);
        else return new Image(bitmap);
    }

    static async typeOf(path: string | Uint8Array): Promise<ImageType> {
        const data = typeof path === "string" ? await Deno.readFile(path) : path;
        if (JPEG.isValid(data)) return ImageType.JPEG;
        if (Decoder_PNG.isValid(data)) return ImageType.PNG;
        if (Decoder_GIF.isValid(data)) return ImageType.GIF;
        if (Decoder_BMP.isValid(data)) return ImageType.BMP;
        return ImageType.None;
    }

    static async resolution(path: string | Uint8Array): Promise<{ width: number; height: number }> {
        const data = typeof path === "string" ? await Deno.readFile(path) : path;
        const res = { width: 0, height: 0 };
        const type = await this.typeOf(data);
        const byteSet = ByteSet.from(data);

        // JPEG
        if (type === ImageType.JPEG) {
            return JPEG.resolution(data);
        }

        return res;
    }
}
