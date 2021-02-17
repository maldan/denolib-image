export enum ColorSpace {
    RGB = "rgb",
    RGBA = "rgba",
}

export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toHex(): string {
        const r = ("00" + (this.r * 255).toString(16)).slice(-2);
        const g = ("00" + (this.g * 255).toString(16)).slice(-2);
        const b = ("00" + (this.b * 255).toString(16)).slice(-2);
        const a = ("00" + (this.a * 255).toString(16)).slice(-2);

        return `#${r}${g}${b}${a}`;
    }

    static fromHex(value: string): Color | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(value);
        return result
            ? new Color(
                  parseInt(result[1], 16) / 255,
                  parseInt(result[2], 16) / 255,
                  parseInt(result[3], 16) / 255,
                  result[4] ? parseInt(result[4], 16) / 255 : 1
              )
            : null;
    }

    static random(): Color {
        return new Color(Math.random(), Math.random(), Math.random(), 1);
    }
}
