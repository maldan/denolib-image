import { Console } from "../../deps.ts";
import { Color, ColorSpace } from "./Color.ts";
import { ColorRGB } from "./ColorRGB.ts";

export class ColorHSV extends Color {
    h: number;
    s: number;
    v: number;

    constructor({ h = 0, s = 0, v = 0 }: { h?: number; s?: number; v?: number }) {
        super();

        this.h = h;
        this.s = s;
        this.v = v;
    }

    convertTo(type: ColorSpace.RGB): ColorRGB;
    convertTo(space: ColorSpace): Color {
        if (space === ColorSpace.RGB) {
            const f = (n: number, k = (n + this.h / 60) % 6) =>
                this.v - this.v * this.s * Math.max(Math.min(k, 4 - k, 1), 0);
            return new ColorRGB({ r: f(5), g: f(3), b: f(1) });
        }
        throw new Error(`Unsupported conversion!`);
    }

    print() {
        let out = "";
        out += Console.rgb24("█", this.convertTo(ColorSpace.RGB).toNumber()) + " ";
        out += `(${this.h.toFixed(2)}, ${this.s.toFixed(2)}, ${this.v.toFixed(2)}) `;
        out += `(${this.h | 0}, ${(this.s * 100) | 0}, ${(this.v * 100) | 0}) `;
        out += `${this.convertTo(ColorSpace.RGB).toHex()} `;
        console.log(out);
    }

    toArray() {
        return [this.h, this.s, this.v];
    }
}
