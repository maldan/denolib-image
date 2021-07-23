import { Color } from "./src/color/Color.ts";
import { Image } from "./src/Image.ts";

const t = await Image.fromUrl("./data/bb.bmp");
console.time("a");
t.bitmap = t.bitmap.grayscale;
console.timeEnd("a");
t.write("./data/tttest.png");
console.log(1684.86 + 52.11);
