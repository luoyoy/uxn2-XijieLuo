"use strict";

import { deviceRead, deviceWrite } from "./Access.js";

export const Controller = 0x80;

function getControllerState(yakuState) {
    if (!yakuState.controllerState) {
        yakuState.controllerState = {
            vector: 0,
            button: 0,
            key: 0,
            events: []
        };
    }
    return yakuState.controllerState;
}

export function controller_deo(args, sz, yakuState) {
    const port = args[0] & 0xf;
    const state = getControllerState(yakuState);

    deviceWrite(args, sz, yakuState);
    if (port === 0x0 || port === 0x1) {
        state.vector = deviceRead([Controller + 0x0], 2, yakuState);
    }

    state.events.push({ kind: "DEO", port, size: sz });
}

export function controller_dei(args, sz, yakuState) {
    const state = getControllerState(yakuState);

    yakuState.Uxn.dev[Controller + 0x2] = state.button & 0xff;
    yakuState.Uxn.dev[Controller + 0x3] = state.key & 0xff;

    state.events.push({ kind: "DEI", port: args[0] & 0xf, size: sz });
    return deviceRead(args, sz, yakuState);
}
