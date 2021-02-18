import { ColorHSV } from "./ColorHSV.ts";
import { ColorRGB } from "./ColorRGB.ts";

export enum ColorSpace {
    RGB = "rgb",
    RGBA = "rgba",
    HSV = "hsv",
}

export class Color {
    /*
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
    }*/

    convertTo(space: ColorSpace) {}

    print() {
        console.log("Color");
    }

    toArray(): number[] {
        return [];
    }
}
