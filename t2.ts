import { ColorSpace } from "./src/color/Color.ts";
import { ColorRGB } from "./src/color/ColorRGB.ts";

const c = new ColorRGB({ hex: 0x92125a });
c.print();
const h = c.convertTo(ColorSpace.HSV);
h.v = 1;
h.print();
