import { EArray } from "../extend-array/mod.ts";
import { BitmapRGB } from "./src/bitmap/BitmapRGB.ts";
import { BMP } from "./src/bmp/BMP.ts";
import { ColorSpace } from "./src/color/Color.ts";
import { ColorRGB } from "./src/color/ColorRGB.ts";
import { HART } from "./src/hart/HART.ts";
import { Image, ImageType } from "./src/Image.ts";

// const img = await Image.from<BitmapRGB>(`C:/Users/black/Desktop/a/t/mina.bmp`);
const img = await Image.from<BitmapRGB>(`./data/pp.bmp`);

const data = HART.encode(img.bitmap);
const data2 = HART.decode(data);

Deno.writeFileSync("./data/t.hart", data);
Deno.writeFileSync("./data/test.bmp", BMP.encode(data2));

// await img.write("./data/test.bmp", ImageType.BMP);

/*const table: { [x: string]: number } = {};
let totalFreq = 0;
img.bitmap.each((r, g, b) => {
    const color = ((r * 255) | 0) + " " + ((g * 255) | 0) + " " + ((b * 255) | 0);
    if (!table[color]) {
        table[color] = 0;
    }
    table[color] += 1;
    totalFreq += 1;
});*/

/*let l = [];
for (const s in table) {
    l.push({
        color: new ColorRGB({ hex: Number(s) }),
        frequency: table[s],
    });
}
l = l.sort((a, b) => b.frequency - a.frequency);*/

/*img.bitmap.eachBlock(8, (colors) => {
    const p = [colors[0], colors[1], colors[2], colors[3]];
    return colors.map((x) => x.closest(p));
});*/

// blocks = blocks.sort((a, b) => a.disturbance - b.disturbance);

// console.log(new ColorRGB(1, 0, 1).difference(new ColorRGB(0.9, 0, 1)));

/*img.bitmap.channel.green.each((x) => {
    return ((x * 64) | 0) / 64;
});
img.bitmap.channel.blue.each((x) => {
    return ((x * 64) | 0) / 64;
});*/

/*console.log(img.bitmap.getPixel(0, 0));
console.log(img.bitmap.getPixel(1, 0));
console.log(img.bitmap.getPixel(1, 1));
console.log(img.bitmap.getPixel(0, 1));*/

/*const t = new BitmapRGB(5, 5);
t.setPixel(0, 0, { r: 1 });
t.setPixel(1, 1, { g: 1 });
t.setPixel(2, 2, { g: 1 });*/

/*const img2 = await Image.fromRaw(`C:/Users/black/Desktop/a/t/rgb2.raw`, 2, 2, ColorSpace.RGB);
console.log(img2.bitmap);*/
