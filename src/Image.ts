import { ByteSet } from "../../bytearray/mod.ts";
// deno-lint-ignore camelcase
import { Decoder_BMP } from "./decode/Decoder_BMP.ts";
// deno-lint-ignore camelcase
import { Decoder_GIF } from "./decode/Decoder_GIF.ts";
// deno-lint-ignore camelcase
import { Decoder_PNG } from "./decode/Decoder_PNG.ts";
import { JPEG } from "./jpeg/JPEG.ts";

enum ImageType {
    None = "none",
    JPEG = "jpeg",
    PNG = "png",
    BMP = "bmp",
    GIF = "gif",
}

export class Image {
    private _buffer: Uint8Array;

    constructor(image: Uint8Array) {
        this._buffer = image;

        if (this.type === ImageType.JPEG) {
            JPEG.decode(image);
        }
    }

    get type() {
        const data = this._buffer;
        if (JPEG.isValid(data)) return ImageType.JPEG;
        if (Decoder_PNG.isValid(data)) return ImageType.PNG;
        if (Decoder_GIF.isValid(data)) return ImageType.GIF;
        if (Decoder_BMP.isValid(data)) return ImageType.BMP;
        return ImageType.None;
    }

    static async from(path: string): Promise<Image> {
        const data = await Deno.readFile(path);
        return new Image(data);
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
