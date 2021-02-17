// deno-lint-ignore camelcase
import { ColorChannel, Type_ChannelRGB, Type_ChannelRGBA } from "../color/ColorChannel.ts";
import { Bitmap } from "./Bitmap.ts";

export class BitmapRGBA extends Bitmap {
    readonly channel!: Type_ChannelRGBA;

    constructor(width: number, height: number) {
        super(width, height);

        this.channel = {
            red: new ColorChannel(width, height),
            green: new ColorChannel(width, height),
            blue: new ColorChannel(width, height),
            alpha: new ColorChannel(width, height),
        };
    }

    setPixel(x: number, y: number, r: number, g: number, b: number) {
        this.channel.red.setPixel(x, y, r);
        this.channel.green.setPixel(x, y, g);
        this.channel.blue.setPixel(x, y, b);
    }
}
