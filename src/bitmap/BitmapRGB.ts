// deno-lint-ignore camelcase
import { ColorChannel, Type_ChannelRGB } from "../color/ColorChannel.ts";
import { ColorRGB } from "../color/ColorRGB.ts";
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

    getPixel(x: number, y: number): ColorRGB {
        return new ColorRGB({
            r: this.channel.red.getPixel(x, y),
            g: this.channel.green.getPixel(x, y),
            b: this.channel.blue.getPixel(x, y),
        });
    }

    each(fn: (color: ColorRGB) => ColorRGB | undefined | void) {
        for (let i = 0; i < this.channel.red.pixels.length; i++) {
            const data = fn(
                new ColorRGB({
                    r: this.channel.red.pixels[i],
                    g: this.channel.green.pixels[i],
                    b: this.channel.blue.pixels[i],
                })
            );
            if (data !== undefined) {
                this.channel.red.pixels[i] = data.r;
                this.channel.green.pixels[i] = data.g;
                this.channel.blue.pixels[i] = data.b;
            }
        }
    }

    eachBlock(
        blockSize: number,
        fn: (color: ColorRGB[], blockId: number) => ColorRGB[] | undefined | void
    ) {
        let blockId = 0;
        for (let j = 0, h = this.height; j < h; j += blockSize) {
            for (let i = 0, w = this.width; i < w; i += blockSize) {
                const values = [];

                // Get block
                for (let y = 0; y < blockSize; y++) {
                    for (let x = 0; x < blockSize; x++) {
                        values.push(this.getPixel(i + x, j + y));
                    }
                }

                // Response
                const response = fn(values, blockId++);
                if (response !== undefined) {
                    for (let y = 0; y < blockSize; y++) {
                        for (let x = 0; x < blockSize; x++) {
                            this.setPixel(
                                i + x,
                                j + y,
                                response[(x % blockSize) + (y % blockSize) * blockSize]
                            );
                        }
                    }
                }
            }
        }
    }

    countColors() {
        //const table: { [x: number]: number } = {};
        const table: number[] = [];

        for (let i = 0, w = this.width; i < w; i++) {
            for (let j = 0, h = this.height; j < h; j++) {
                const hex =
                    (((this.channel.red.pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 16) |
                    (((this.channel.green.pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 8) |
                    (((this.channel.blue.pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 0);

                table[hex] = ~~table[hex] + 1;
            }
        }

        let l = [];
        for (const s in table) {
            l.push({
                color: new ColorRGB({ hex: Number(s) }),
                frequency: table[s],
            });
        }

        l = l.sort((a, b) => b.frequency - a.frequency);

        return l;
    }
}
