import { Image } from "./src/Image.ts";

// et img = await Image.from("./test/guguru.jpg");
console.log(await Image.resolution("./test/data/guguru.jpg"));
console.log(await Image.resolution("./test/data/jpg2.jpg"));
