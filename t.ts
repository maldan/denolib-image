import { Color } from "./src/color/Color.ts";
import { Image } from "./src/Image.ts";

const img = await Image.fromUrl(`./data/bb.bmp`);

console.time("a");
img.bitmap.map((x, i) => {
    x.quantize(16);
    return x;
});
console.timeEnd("a");

//img.bitmap.setPixel(1, 1, { r: 1, a: 1 });
img.write("C:/Users/black/Desktop/sas.png");
