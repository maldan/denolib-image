// deno-lint-ignore camelcase
export class Decoder_BMP {
    static isValid(data: Uint8Array) {
        return data[0] === 0x42 && data[1] === 0x4d;
    }

    static resolution(data: Uint8Array): { width: number; height: number } {
        const res = { width: 0, height: 0 };

        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0xff && data[i + 1] === 0xc0) {
                return {
                    width: (data[i + 5] << 8) | data[i + 6],
                    height: (data[i + 7] << 8) | data[i + 8],
                };
            }
        }

        return res;
    }
}
