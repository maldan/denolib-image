import { BitmapRGB } from "./src/bitmap/BitmapRGB.ts";
import { BMP } from "./src/bmp/BMP.ts";
import { ColorSpace } from "./src/color/Color.ts";
import { Image, ImageType } from "./src/Image.ts";

const img = await Image.from<BitmapRGB>(`C:/Users/black/Desktop/a/t/mina.bmp`);

const table: { [x: number]: number } = {};
img.bitmap.channel.red.pixels.map((x) => {
    x = ((x * 255) / 64) | 0;
    if (!table[x]) {
        table[x] = 0;
    }
    table[x] += 1;
    return x / 64;
});

console.log(table);

/*console.log(img.bitmap.getPixel(0, 0));
console.log(img.bitmap.getPixel(1, 0));
console.log(img.bitmap.getPixel(1, 1));
console.log(img.bitmap.getPixel(0, 1));*/

/*const t = new BitmapRGB(5, 5);
t.setPixel(0, 0, { r: 1 });
t.setPixel(1, 1, { g: 1 });
t.setPixel(2, 2, { g: 1 });*/

await img.write("./test.bmp", ImageType.BMP);

/*const img2 = await Image.fromRaw(`C:/Users/black/Desktop/a/t/rgb2.raw`, 2, 2, ColorSpace.RGB);
console.log(img2.bitmap);*/
