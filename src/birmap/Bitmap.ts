import { ByteSet } from "../../deps.ts";
import { ColorSpace } from "../../mod.ts";
import { Channel } from "../color/Channel.ts";
import { Color } from "../color/Color.ts";

export class Bitmap {
    readonly width;
    readonly height;
    readonly channel: Channel[] = [];
    readonly space: ColorSpace;

    constructor(width: number, height: number, space: ColorSpace = ColorSpace.RGB) {
        this.width = width;
        this.height = height;
        this.space = space;

        if (ColorSpace.RGBA) {
            this.channel = [
                new Channel(width, height),
                new Channel(width, height),
                new Channel(width, height),
                new Channel(width, height),
            ];
        } else {
            this.channel = [
                new Channel(width, height),
                new Channel(width, height),
                new Channel(width, height),
            ];
        }
    }

    setPixel(
        x: number,
        y: number,
        { c0 = 0, c1 = 0, c2 = 0, c3 = 0 }: { c0?: number; c1?: number; c2?: number; c3?: number }
    ) {
        if (this.space === ColorSpace.RGB || this.space === ColorSpace.RGBA) {
            this.channel[0]?.setPixel(x, y, c0);
            this.channel[1]?.setPixel(x, y, c1);
            this.channel[2]?.setPixel(x, y, c2);
            this.channel[3]?.setPixel(x, y, c3);
        }
    }

    getPixel(x: number, y: number): Color {
        return new Color(this.space, {
            c0: this.channel[0]?.getPixel(x, y) ?? 0,
            c1: this.channel[1]?.getPixel(x, y) ?? 0,
            c2: this.channel[2]?.getPixel(x, y) ?? 0,
            c3: this.channel[3]?.getPixel(x, y) ?? 0,
        });
    }

    getAvgPixel(x: number, y: number, width: number, height: number): Color {
        return new Color(this.space, {
            c0: this.channel[0]?.getAvgPixel(x, y, width, height) ?? 0,
            c1: this.channel[1]?.getAvgPixel(x, y, width, height) ?? 0,
            c2: this.channel[2]?.getAvgPixel(x, y, width, height) ?? 0,
            c3: this.channel[3]?.getAvgPixel(x, y, width, height) ?? 0,
        });
    }

    getMaxPixel(x: number, y: number, width: number, height: number): Color {
        return new Color(this.space, {
            c0: this.channel[0]?.getMaxPixel(x, y, width, height) ?? 0,
            c1: this.channel[1]?.getMaxPixel(x, y, width, height) ?? 0,
            c2: this.channel[2]?.getMaxPixel(x, y, width, height) ?? 0,
            c3: this.channel[3]?.getMaxPixel(x, y, width, height) ?? 0,
        });
    }

    forEach(fn: (color: Color, index: number, x: number, y: number) => void) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.channel[0].pixels.length; i++) {
            fn(
                new Color(this.space, {
                    c0: this.channel[0]?.pixels[i],
                    c1: this.channel[1]?.pixels[i],
                    c2: this.channel[2]?.pixels[i],
                    c3: this.channel[3]?.pixels[i],
                }),
                i,
                x,
                y
            );
            x += 1;
            if (x >= this.width) {
                x = 0;
                y += 1;
            }
        }
    }

    map(fn: (color: Color, index: number, x: number, y: number) => Color | undefined | void) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.channel[0].pixels.length; i++) {
            const data = fn(
                new Color(this.space, {
                    c0: this.channel[0]?.pixels[i],
                    c1: this.channel[1]?.pixels[i],
                    c2: this.channel[2]?.pixels[i],
                    c3: this.channel[3]?.pixels[i],
                }),
                i,
                x,
                y
            );
            if (data) {
                this.channel[0].pixels[i] = data.c0;
                this.channel[1].pixels[i] = data.c1;
                this.channel[2].pixels[i] = data.c2;
                this.channel[3].pixels[i] = data.c3;
            }

            x += 1;
            if (x >= this.width) {
                x = 0;
                y += 1;
            }
        }
    }

    mapBlock(
        blockSize: number,
        fn: (color: Color[], blockId: number) => Color[] | undefined | void
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
                if (response) {
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

    toBuffer(): Uint8Array {
        if (this.space === ColorSpace.RGBA) {
            const b = new ByteSet(this.width * this.height * 4);

            for (let j = 0; j < this.height; j++) {
                for (let i = 0; i < this.width; i++) {
                    for (let k = 0; k < 4; k++) {
                        b.write.uint8(Math.min(this.channel[k].getPixel(i, j) * 255, 255));
                    }
                }
            }
            return b.buffer;
        } else {
            const b = new ByteSet(this.width * this.height * 3);

            for (let j = 0; j < this.height; j++) {
                for (let i = 0; i < this.width; i++) {
                    for (let k = 0; k < 3; k++) {
                        b.write.uint8(Math.min(this.channel[k].getPixel(i, j) * 255, 255));
                    }
                }
            }
            return b.buffer;
        }
    }

    countColors() {
        const table: number[] = [];

        for (let i = 0, w = this.width; i < w; i++) {
            for (let j = 0, h = this.height; j < h; j++) {
                const hex =
                    (((this.channel[0].pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 16) |
                    (((this.channel[1].pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 8) |
                    (((this.channel[2].pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 0) |
                    (((this.channel[0].pixels[(~~i % w) + (~~j % h) * w] * 255) | 0) << 24);

                table[hex] = ~~table[hex] + 1;
            }
        }

        let l = [];
        for (const s in table) {
            l.push({
                color: new Color(this.space, { hex: Number(s) }),
                frequency: table[s],
            });
        }

        l = l.sort((a, b) => b.frequency - a.frequency);

        return l;
    }

    get grayscale() {
        const b = new Bitmap(this.width, this.height, ColorSpace.Grayscale);
        this.forEach((color, index, x, y) => {
            const g = color.grayscale();
            b.channel[0].setPixel(x, y, g.c0);
            b.channel[1].setPixel(x, y, g.c0);
            b.channel[2].setPixel(x, y, g.c0);
        });
        return b;
    }
}
