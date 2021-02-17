import { ByteSet, NumberType } from "../../deps.ts";
import { JPEG } from "./JPEG.ts";

const SOI = 0xffd8;
const SOF0 = 0xffc0;
const COM = 0xfffe;
const DQT = 0xffdb;
const DHT = 0xffc4;
const SOS = 0xffda;
const EOI = 0xffd9;

export class Decoder {
    decode(data: Uint8Array) {
        if (!JPEG.isValid(data)) {
            return null;
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
        const dctZigZag = new Uint8Array([
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
        ]);

        const tableValLen = (info & 0x0f) === 0 ? 1 : 2;
        const tableId = (info & 0xf0) >> 4;

        console.log("DQT", tableValLen, tableId);

        let out = "";
        for (let i = 0; i < 64; i++) {
            out += b.buffer[dctZigZag[i] + 1].toString(16) + " ";
            if ((i + 1) % 8 === 0) {
                out += "\n";
            }
        }
        console.log(out);
        // b.print();
    }

    readSOF0(bytes: ByteSet) {
        console.log("SOF0");
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2), "big");

        console.log("prec", b.read.uint8());
        console.log("w", b.read.uint16());
        console.log("h", b.read.uint16());

        const channels = b.read.uint8();
        for (let i = 0; i < channels; i++) {
            const id = b.read.uint8();
            const info = b.read.uint8();
            const hh = info & 0x0f;
            const vv = (info & 0xf0) >> 4;
            const qTableId = b.read.uint8();

            console.log(id, hh, vv, qTableId);
        }
    }

    readDHT(bytes: ByteSet) {
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2), "big");
        const info = b.read.uint8();
        const tableId = (info & 0xf0) >> 4;
        const isDC = info & 0x0f ? false : true;
        const isAC = !isDC;
        console.log("DHT", isDC ? "DC" : "AC", tableId);

        const codeLen = b.read.uint8Array(16);

        b.read.each(NumberType.Uint8, (x) => {
            console.log("code", x);
        });

        b.print();
    }

    readSOS(bytes: ByteSet) {
        console.log("SOS");
        const len = bytes.read.uint16();
        bytes.read.uint8Array(len - 2);

        for (let i = bytes.position; i < bytes.length; i++) {
            // console.log(bytes.read.uint8().toString(16));
        }
    }

    readEOI(bytes: ByteSet) {
        console.log("EOI");
    }
}
