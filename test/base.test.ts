import {
    assertEquals,
    assertObjectMatch,
    assertThrows,
} from "https://deno.land/std@0.86.0/testing/asserts.ts";
import { Image } from "./../src/Image.ts";

Deno.test("format reading", async () => {
    let img = await Image.from("./test/data/guguru.jpg");
    assertEquals(img.type, "jpeg");

    img = await Image.from("./test/data/jpg2.jpg");
    assertEquals(img.type, "jpeg");

    img = await Image.from("./test/data/png.png");
    assertEquals(img.type, "png");

    img = await Image.from("./test/data/gif.gif");
    assertEquals(img.type, "gif");

    img = await Image.from("./test/data/bmp.bmp");
    assertEquals(img.type, "bmp");
});

Deno.test("resolution reading", async () => {
    assertObjectMatch(await Image.resolution("./test/data/guguru.jpg"), { width: 16, height: 16 });
    assertObjectMatch(await Image.resolution("./test/data/jpg2.jpg"), { width: 10, height: 10 });
});
