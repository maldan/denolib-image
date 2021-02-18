import {
    assertEquals,
    assertObjectMatch,
    assertThrows,
} from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { ColorRGB } from "../src/color/ColorRGB.ts";

Deno.test("closest color", () => {
    const colors = [
        new ColorRGB({ r: 1, g: 1, b: 1 }),
        new ColorRGB({ r: 1 }),
        new ColorRGB({ g: 1 }),
        new ColorRGB({ b: 1 }),
        new ColorRGB({}),
    ];
    const c1 = new ColorRGB({ r: 1, g: 1, b: 1 });
    const c2 = new ColorRGB({ r: 1 });
    const c3 = new ColorRGB({ g: 1 });
    const c4 = new ColorRGB({ b: 1 });
    const c5 = new ColorRGB({ r: 1, g: 0.6, b: 0.6 });

    assertEquals(c1.closest(colors), c1);
    assertEquals(c2.closest(colors), c2);
    assertEquals(c3.closest(colors), c3);
    assertEquals(c4.closest(colors), c4);
    assertEquals(c5.closest(colors), c1);
});
