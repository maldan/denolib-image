import { Console } from "../../deps.ts";
import { Color, ColorSpace } from "./Color.ts";
import { ColorHSV } from "./ColorHSV.ts";

export class ColorRGB extends Color {
    r = 0;
    g = 0;
    b = 0;

    constructor({
        r = 0,
        g = 0,
        b = 0,
        hex = 0,
    }: {
        r?: number;
        g?: number;
        b?: number;
        hex?: number | string;
    }) {
        super();

        if (hex) {
            if (typeof hex === "number") {
                this.r = ((hex >> 16) & 0xff) / 255;
                this.g = ((hex >> 8) & 0xff) / 255;
                this.b = (hex & 0xff) / 255;
            } else {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
                if (result) {
                    this.r = parseInt(result[1], 16) / 255;
                    this.g = parseInt(result[2], 16) / 255;
                    this.b = parseInt(result[3], 16) / 255;
                }
            }
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    difference(c: ColorRGB): number {
        return Math.abs(this.r - c.r) + Math.abs(this.g - c.g) + Math.abs(this.b - c.b);
    }

    closest(colors: ColorRGB[]) {
        let closestId = 0;
        let closestColor = this.difference(colors[0]);

        for (let i = 1; i < colors.length; i++) {
            const d =
                Math.abs(this.r - colors[i].r) +
                Math.abs(this.g - colors[i].g) +
                Math.abs(this.b - colors[i].b);
            closestColor = Math.min(closestColor, d);
            if (closestColor === d) {
                closestId = i;
            }
        }
        return colors[closestId];

        /*let t = [];

        for (let i = 0; i < colors.length; i++) {
            t.push({
                id: i,
                value:
                    Math.abs(this.r - colors[i].r) +
                    Math.abs(this.g - colors[i].g) +
                    Math.abs(this.b - colors[i].b),
            });
        }
        t = t.sort((a, b) => a.value - b.value);
        return colors[t[0].id];*/
    }

    convertTo(type: ColorSpace.HSV): ColorHSV;
    convertTo(space: ColorSpace): Color {
        if (space === ColorSpace.HSV) {
            const v = Math.max(this.r, this.g, this.b);
            const c = v - Math.min(this.r, this.g, this.b);
            const h =
                c &&
                (v == this.r
                    ? (this.g - this.b) / c
                    : v == this.g
                    ? 2 + (this.b - this.r) / c
                    : 4 + (this.r - this.g) / c);

            return new ColorHSV({
                h: 60 * (h < 0 ? h + 6 : h),
                s: v && c / v,
                v,
            });
        }
        throw new Error(`Unsupported conversion!`);
    }

    print() {
        let out = "";
        out += Console.rgb24("█", this.toNumber()) + " ";
        out += `(${this.r.toFixed(2)}, ${this.g.toFixed(2)}, ${this.b.toFixed(2)}) `;
        out += `(${(this.r * 255) | 0}, ${(this.g * 255) | 0}, ${(this.b * 255) | 0}) `;
        out += `${this.toHex()} `;
        console.log(out);
    }

    set color(value: number) {
        this.r = ((value >> 16) & 0xff) / 255;
        this.g = ((value >> 8) & 0xff) / 255;
        this.b = (value & 0xff) / 255;
    }

    toString() {
        return `r: ${this.r.toFixed(2)} g: ${this.g.toFixed(2)} b: ${this.b.toFixed(2)}`;
    }

    toArray() {
        return [this.r, this.g, this.b];
    }

    toHex() {
        return (
            "#" +
            ("00" + ((this.r * 255) | 0).toString(16)).slice(-2) +
            ("00" + ((this.g * 255) | 0).toString(16)).slice(-2) +
            ("00" + ((this.b * 255) | 0).toString(16)).slice(-2)
        ).toUpperCase();
    }

    toNumber() {
        const r = ((this.r * 255) | 0) << 16;
        const g = ((this.g * 255) | 0) << 8;
        const b = ((this.b * 255) | 0) << 0;
        return r | g | b;
    }
}
