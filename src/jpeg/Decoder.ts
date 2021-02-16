import { ByteSet } from "../../deps.ts";
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
        console.log("DQT");
        const len = bytes.read.uint16();
        bytes.read.uint8Array(len - 2);
    }

    readSOF0(bytes: ByteSet) {
        console.log("SOF0");
        const len = bytes.read.uint16();
        bytes.read.uint8Array(len - 2);
    }

    readDHT(bytes: ByteSet) {
        const len = bytes.read.uint16();
        const b = ByteSet.from(bytes.read.uint8Array(len - 2));
        const info = b.read.uint8();
        const tableId = (info & 0xf0) >> 4;
        const isDC = info & 0x0f ? false : true;
        const isAC = !isDC;
        console.log("DHT", isDC ? "DC" : "AC", tableId);
    }

    readSOS(bytes: ByteSet) {
        console.log("SOS");
        const len = bytes.read.uint16();
        bytes.read.uint8Array(len - 2);

        for (let i = bytes.position; i < bytes.length; i++) {
            console.log(bytes.read.uint8().toString(16));
        }
    }

    readEOI(bytes: ByteSet) {
        console.log("EOI");
    }
}
