// deno-lint-ignore camelcase
import { ColorChannel, Type_ChannelRGB } from "../color/ColorChannel.ts";
import { Bitmap } from "./Bitmap.ts";

export class BitmapRGB extends Bitmap {
    readonly channel!: Type_ChannelRGB;

    constructor(width: number, height: number) {
        super(width, height);

        this.channel = {
            red: new ColorChannel(width, height),
            green: new ColorChannel(width, height),
            blue: new ColorChannel(width, height),
        };
    }

    setPixel(
        x: number,
        y: number,
        { r = 0, g = 0, b = 0 }: { r?: number; g?: number; b?: number }
    ) {
        this.channel.red.setPixel(x, y, r);
        this.channel.green.setPixel(x, y, g);
        this.channel.blue.setPixel(x, y, b);
    }

    getPixel(x: number, y: number): number[] {
        return [
            this.channel.red.getPixel(x, y),
            this.channel.green.getPixel(x, y),
            this.channel.blue.getPixel(x, y),
        ];
    }
}
