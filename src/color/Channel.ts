export class Channel {
    pixels: Float32Array;

    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Float32Array(width * height);
    }

    getAvgPixel(x: number, y: number, width: number, height: number) {
        let value = 0;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const fx = (x + i - width / 2) | 0;
                const fy = (y + j - height / 2) | 0;
                value += this.pixels[(fx % this.width) + (fy % this.height) * this.width] ?? 0;
            }
        }

        return value / (width * height);
    }

    getMaxPixel(x: number, y: number, width: number, height: number) {
        const value = new Array(width * height);
        let pos = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const fx = (x + i - width / 2) | 0;
                const fy = (y + j - height / 2) | 0;
                value[pos++] =
                    this.pixels[(fx % this.width) + (fy % this.height) * this.width] ?? 0;
            }
        }

        return Math.max(...value);
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

    /*map(fn: (c: number) => number | undefined | void) {
        for (let i = 0; i < this.pixels.length; i++) {
            const data = fn(this.pixels[i]);
            if (data !== undefined) {
                this.pixels[i] = data;
            }
        }
    }*/
}
