"use strict";

const VERSION = "1.0.0";

import { unsignedShortToUnsignedBytes, unsignedBytesToUnsignedShort } from "../../IntegerFormatConversions.js";

export function deviceRead(args,sz,yakuState) {
    let dev_addr = args[0];
    let hi_byte = yakuState['Uxn']['dev'][dev_addr];
    if (sz==1) {
        return hi_byte === undefined ? 0 : hi_byte;
    } else {
        let lo_byte = yakuState['Uxn']['dev'][dev_addr+1] 
        if (lo_byte === undefined) { lo_byte = 0; }
        return unsignedBytesToUnsignedShort(hi_byte,lo_byte)
    }
}

export function deviceWrite(args,sz,yakuState) {
    let dev_addr = args[0];
    if (sz==1) {
        yakuState['Uxn']['dev'][dev_addr] = args[1];
    } else {
        let hi_byte = args[1] >> 8;
        let lo_byte = args[1] & 0xff;
        yakuState['Uxn']['dev'][dev_addr] = hi_byte;
        yakuState['Uxn']['dev'][dev_addr+1] = lo_byte;
    }
}
