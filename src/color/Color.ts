import { Console } from "../../deps.ts";
import { ColorSpace } from "./../../mod.ts";
import { Channel } from "./Channel.ts";

export class Color {
    c0 = 0;
    c1 = 0;
    c2 = 0;
    c3 = 0;
    space: ColorSpace;

    constructor(
        space: ColorSpace,
        {
            c0,
            c1,
            c2,
            c3,
            hex,
        }: {
            c0?: number;
            c1?: number;
            c2?: number;
            c3?: number;
            hex?: number | string;
        } = {
            c0: 0,
            c1: 0,
            c2: 0,
            c3: 0,
            hex: 0,
        }
    ) {
        this.space = space;

        if (hex) {
            this.color = hex;
        } else {
            this.c0 = c0 ?? 0;
            this.c1 = c1 ?? 0;
            this.c2 = c2 ?? 0;
            this.c3 = c3 ?? 0;
        }
    }

    get [0]() {
        return this.c0;
    }

    difference(c: Color): number {
        return (
            (Math.abs(this.c0 - c.c0) +
                Math.abs(this.c1 - c.c1) +
                Math.abs(this.c2 - c.c2) +
                Math.abs(this.c3 - c.c3)) /
            4
        );
    }

    set color(value: number | string) {
        if (typeof value === "number") {
            switch (this.space) {
                case ColorSpace.RGB:
                    this.c0 = ((value >> 16) & 0xff) / 255;
                    this.c1 = ((value >> 8) & 0xff) / 255;
                    this.c2 = (value & 0xff) / 255;
                    break;
                default:
                    throw new Error(`A`);
            }
        } else {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(value);

            switch (this.space) {
                case ColorSpace.RGB:
                    if (result) {
                        this.c0 = parseInt(result[1], 16) / 255;
                        this.c1 = parseInt(result[2], 16) / 255;
                        this.c2 = parseInt(result[3], 16) / 255;
                    }
                    break;
                default:
                    throw new Error(`A`);
            }
        }
    }

    toArray() {
        switch (this.space) {
            case ColorSpace.RGB:
                return [this.c0, this.c1, this.c2];
            default:
                throw new Error(`A`);
        }
    }

    print() {
        let out = "";

        switch (this.space) {
            case ColorSpace.RGB:
                out += Console.rgb24("█", this.toNumber()) + " ";
                out += `(${this.c0.toFixed(2)}, ${this.c1.toFixed(2)}, ${this.c2.toFixed(2)}) `;
                out += `(${(this.c0 * 255) | 0}, ${(this.c1 * 255) | 0}, ${(this.c2 * 255) | 0}) `;
                out += `${this.toHex()} `;
                break;
            default:
                throw new Error(`A`);
        }

        console.log(out);
    }

    toHex() {
        switch (this.space) {
            case ColorSpace.RGB:
                return (
                    "#" +
                    ("00" + ((this.c0 * 255) | 0).toString(16)).slice(-2) +
                    ("00" + ((this.c1 * 255) | 0).toString(16)).slice(-2) +
                    ("00" + ((this.c2 * 255) | 0).toString(16)).slice(-2)
                ).toUpperCase();
            default:
                throw new Error(`A`);
        }
    }

    mul(c0 = 1, c1 = 1, c2 = 1, c3 = 1) {
        this.c0 *= c0;
        this.c1 *= c1;
        this.c2 *= c2;
        this.c3 *= c3;
    }

    quantize(level = 255) {
        this.c0 = Math.round(this.c0 * level) / level;
        this.c1 = Math.round(this.c1 * level) / level;
        this.c2 = Math.round(this.c2 * level) / level;
        this.c3 = Math.round(this.c3 * level) / level;
    }

    toNumber() {
        switch (this.space) {
            case ColorSpace.RGB:
                return (
                    (((this.c0 * 255) | 0) << 16) |
                    (((this.c1 * 255) | 0) << 8) |
                    (((this.c2 * 255) | 0) << 0)
                );
            default:
                throw new Error(`A`);
        }
    }
}
