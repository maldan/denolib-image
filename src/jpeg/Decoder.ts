import { BitArray } from "../../../bytearray/mod.ts";
// deno-lint-ignore camelcase
import { Huffman, Type_HuffmanObjectTree } from "../../../compress/mod.ts";
import { ByteSet, NumberType } from "../../deps.ts";
import { Bitmap } from "../bitmap/Bitmap.ts";
import { BitmapRGB } from "../bitmap/BitmapRGB.ts";
import { JPEG } from "./JPEG.ts";

const SOI = 0xffd8;
const SOF0 = 0xffc0;
const COM = 0xfffe;
const DQT = 0xffdb;
const DHT = 0xffc4;
const SOS = 0xffda;
const EOI = 0xffd9;

const ZigZag = [
    0,
    1,
    8,
    16,
    9,
    2,
    3,
    10,
    17,
    24,
    32,
    25,
    18,
    11,
    4,
    5,
    12,
    19,
    26,
    33,
    40,
    48,
    41,
    34,
    27,
    20,
    13,
    6,
    7,
    14,
    21,
    28,
    35,
    42,
    49,
    56,
    57,
    50,
    43,
    36,
    29,
    22,
    15,
    23,
    30,
    37,
    44,
    51,
    58,
    59,
    52,
    45,
    38,
    31,
    39,
    46,
    53,
    60,
    61,
    54,
    47,
    55,
    62,
    63,
];

export class Decoder {
    private _huffmanTableAC: Type_HuffmanObjectTree[] = [];
    private _huffmanTableDC: Type_HuffmanObjectTree[] = [];

    decode<T>(data: Uint8Array): T {
        if (!JPEG.isValid(data)) {
            throw new Error(`Not a jpg image!`);
        }

        const bytes = ByteSet.from(data, "big");
        bytes.read.uint16(); // Skip soi

        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);
        this.readMarker(bytes);

        return (new BitmapRGB(32, 32) as unknown) as T;
    }

    readMarker(bytes: ByteSet) {
        const marker = bytes.read.uint16();

        switch (marker) {
            case COM:
                this.readComment(bytes);
                break;
            case DQT:
                this.readDQT(bytes);
                break;
            case SOF0:
                this.readSOF0(bytes);
                break;
            case DHT:
                this.readDHT(bytes);
                break;
            case SOS:
                this.readSOS(bytes);
                break;
            default:
                console.log("p", bytes.position);
                throw new Error(`Unknown marker ${marker.toString(16)}`);
        }
    }

    readComment(bytes: ByteSet) {
        console.log("COM");
        const len = bytes.read.uint16();
        const comment = bytes.read.string(len - 2);
    }

    readDQT(bytes: ByteSet) {
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2), "big");
        const info = b.read.uint8();

        const tableValLen = (info & 0x0f) === 0 ? 1 : 2;
        const tableId = (info & 0xf0) >> 4;

        /*console.log("DQT", tableValLen, tableId);

        let out = "";
        for (let i = 0; i < 64; i++) {
            out += b.buffer[dctZigZag[i] + 1].toString(16) + " ";
            if ((i + 1) % 8 === 0) {
                out += "\n";
            }
        }
        console.log(out);*/
        // b.print();
    }

    readSOF0(bytes: ByteSet) {
        console.log("SOF0");
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2), "big");

        b.read.uint8(); // prec
        b.read.uint16(); // w
        b.read.uint16(); // h

        const channels = b.read.uint8();
        for (let i = 0; i < channels; i++) {
            const id = b.read.uint8();
            const info = b.read.uint8();
            const hh = info & 0x0f;
            const vv = (info & 0xf0) >> 4;
            const qTableId = b.read.uint8();

            // console.log(id, hh, vv, qTableId);
        }
    }

    readDHT(bytes: ByteSet) {
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2), "big");
        const info = b.read.uint8ByBits(4, 4);
        const tableId = info[0];
        const isDC = info[1] === 0 ? true : false;
        const isAC = !isDC;
        console.log("DHT", isDC ? "DC" : "AC", tableId);

        const codeLenInfo = Array.from(b.read.uint8Array(16));
        const codes: number[] = [];
        const codeLen: number[] = [];

        codeLenInfo.forEach((x, i) => {
            if (x === 0) return;

            codeLen.push(...new Array(x).fill(i + 1));
        });

        b.read.each(NumberType.Uint8, (x) => {
            codes.push(x);
        });

        const table = Huffman.buildCodeTableFromLength(codes, codeLen);

        if (isDC) {
            this._huffmanTableDC[tableId] = Huffman.buildCodeTree(table);
        } else {
            this._huffmanTableAC[tableId] = Huffman.buildCodeTree(table);
        }
    }

    fuckMCU(bits: BitArray, tables: number[][]) {
        const matrixList = [];
        const matrix = [];

        let codeLen = 0;

        // deno-lint-ignore no-explicit-any
        let branch: any = this._huffmanTableDC[0];
        bits.read.each(1, (x, i) => {
            branch = branch[x];
            if (typeof branch === "number") {
                codeLen = branch;
            }
        });
    }

    readSOS(bytes: ByteSet) {
        console.log("SOS");
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2));

        const channels = b.read.uint8();
        const tables = [];
        for (let i = 0; i < channels; i++) {
            b.read.uint8(); // ch id
            tables.push(b.read.uint8ByBits(4, 4)); // DC AC Table Id
        }
        b.read.uint24(); // skip progressive info

        // Bits array
        let bits = new BitArray();
        bytes.read.each(NumberType.Uint8, (x) => {
            bits.write.uint8(x);
        });
        bits = bits.slice(0, -16); // skip end marker

        this.fuckMCU(bits, tables);
    }

    readEOI(bytes: ByteSet) {
        console.log("EOI");
    }
}
