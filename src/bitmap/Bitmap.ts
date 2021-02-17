// deno-lint-ignore camelcase
import { ColorChannel, Type_ChannelRGB } from "./../color/ColorChannel.ts";

export class Bitmap {
    readonly width;
    readonly height;
    readonly channel!: unknown;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
