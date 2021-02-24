export class Channel {
    pixels: number[] = [];

    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels.length = width * height;
        this.pixels.fill(0);
    }

    getPixel(x: number, y: number) {
        if (x < 0 || y < 0 || x > this.width || y > this.height) {
            return 0;
        }
        return this.pixels[(~~x % this.width) + (~~y % this.height) * this.width] || 0;
    }

    setPixel(x: number, y: number, value: number) {
        if (x < 0 || y < 0 || x > this.width || y > this.height) {
            return;
        }
        this.pixels[(~~x % this.width) + (~~y % this.height) * this.width] = value;
    }

    each(fn: (c: number) => number | undefined | void) {
        for (let i = 0; i < this.pixels.length; i++) {
            const data = fn(this.pixels[i]);
            if (data !== undefined) {
                this.pixels[i] = data;
            }
        }
    }
}
