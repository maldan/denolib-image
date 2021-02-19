# Image

Deno module for work with images. Module will provide functions like decode, encode, get resolution, get image type, scale, resize and other stuff.

---

### NOTE! Currently is under development.

---

## Current state

Now it only can get type of image from file but it based on content not on name extension. Also it can return jpeg image resolution.

## Plans

### Decode

-   [x] RAW (3 channels, interlaced)
-   [x] BMP (BITMAPINFOHEADER, no compression, only 24 bits)
-   [ ] JPEG
-   [ ] PNG
-   [ ] GIF
-   [ ] WebP

### Encode

-   [x] BMP (BITMAPINFOHEADER, no compression, only 24 bits)
-   [ ] JPEG
-   [ ] PNG
-   [ ] GIF
-   [ ] WebP
