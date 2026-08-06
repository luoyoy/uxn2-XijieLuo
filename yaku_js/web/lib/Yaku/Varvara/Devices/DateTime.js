"use strict";

import { deviceRead, deviceWrite } from "./Access.js";

export const DateTime = 0xc0;

function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function writeDateTimeState(yakuState) {
    const now = new Date();
    const year = now.getFullYear();
    const doty = dayOfYear(now);

    yakuState.Uxn.dev[DateTime + 0x0] = (year >> 8) & 0xff;
    yakuState.Uxn.dev[DateTime + 0x1] = year & 0xff;
    yakuState.Uxn.dev[DateTime + 0x2] = now.getMonth() + 1;
    yakuState.Uxn.dev[DateTime + 0x3] = now.getDate();
    yakuState.Uxn.dev[DateTime + 0x4] = now.getHours();
    yakuState.Uxn.dev[DateTime + 0x5] = now.getMinutes();
    yakuState.Uxn.dev[DateTime + 0x6] = now.getSeconds();
    yakuState.Uxn.dev[DateTime + 0x7] = now.getDay();
    yakuState.Uxn.dev[DateTime + 0x8] = (doty >> 8) & 0xff;
    yakuState.Uxn.dev[DateTime + 0x9] = doty & 0xff;
    yakuState.Uxn.dev[DateTime + 0xa] = 0;
}

export function datetime_dei(args, sz, yakuState) {
    writeDateTimeState(yakuState);
    return deviceRead(args, sz, yakuState);
}

export function datetime_deo(args, sz, yakuState) {
    deviceWrite(args, sz, yakuState);
}
