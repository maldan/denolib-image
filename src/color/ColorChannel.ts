// deno-lint-ignore camelcase
export type Type_ChannelRGB = {
    red: ColorChannel;
    green: ColorChannel;
    blue: ColorChannel;
};

// deno-lint-ignore camelcase
export type Type_ChannelRGBA = {
    red: ColorChannel;
    green: ColorChannel;
    blue: ColorChannel;
    alpha: ColorChannel;
};

export class ColorChannel {
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
        return this.pixels[(~~x % this.width) + (~~y % this.height) * this.width] || 0;
    }

    setPixel(x: number, y: number, value: number) {
        this.pixels[(~~x % this.width) + (~~y % this.height) * this.width] = value;
    }
}
