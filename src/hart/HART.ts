import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { Decoder } from "./Decoder.ts";
import { Encoder } from "./Encoder.ts";

export class HART {
    static decode(data: Uint8Array): BitmapRGB {
        return new Decoder().decode(data);
    }

    static encode(bitmap: BitmapRGB): Uint8Array {
        return new Encoder().encode(bitmap);
    }
}
