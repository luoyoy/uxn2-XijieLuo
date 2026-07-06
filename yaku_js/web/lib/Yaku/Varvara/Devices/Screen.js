"use strict";

const VERSION = "1.0.0";

import { deviceRead, deviceWrite } from "./Access.js";

export const Screen = 0x20;

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 240;

function getScreenState(yakuState) {
    if (!yakuState.screenState) {
        yakuState.screenState = {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            auto: 0,
            x: 0,
            y: 0,
            addr: 0,
            lastPixelCommand: null,
            lastSpriteCommand: null,
            events: []
        };
    }
    return yakuState.screenState;
}

function readShort(yakuState, port) {
    return deviceRead([Screen + port], 2, yakuState);
}

function createCanvasPrototype(state) {
    if (typeof document === "undefined") {
        return;
    }

    let canvas = document.getElementById("yaku-screen-prototype");
    if (!canvas) {
        const wrapper = document.createElement("section");
        wrapper.id = "yaku-screen-wrapper";
        wrapper.style.margin = "1rem 0";
        wrapper.style.padding = "0.75rem";
        wrapper.style.border = "1px solid #999";
        wrapper.style.background = "#f8f8f8";

        const title = document.createElement("h3");
        title.textContent = "Screen prototype";
        title.style.marginTop = "0";

        canvas = document.createElement("canvas");
        canvas.id = "yaku-screen-prototype";
        canvas.style.border = "1px solid #333";
        canvas.style.imageRendering = "pixelated";

        const status = document.createElement("p");
        status.id = "yaku-screen-status";
        status.style.fontFamily = "monospace";

        wrapper.appendChild(title);
        wrapper.appendChild(canvas);
        wrapper.appendChild(status);
        document.body.appendChild(wrapper);
    }

    canvas.width = state.width;
    canvas.height = state.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.strokeStyle = "#cccccc";
    ctx.strokeRect(0, 0, state.width - 1, state.height - 1);

    const status = document.getElementById("yaku-screen-status");
    if (status) {
        status.textContent = `size=${state.width}x${state.height}, x=${state.x}, y=${state.y}, addr=0x${state.addr.toString(16)}`;
    }
}

export function screen_deo(args,sz,yakuState) {
    let dev_addr = args[0];
    let port = dev_addr & 0xf;
    deviceWrite(args,sz,yakuState);

    const state = getScreenState(yakuState);
    if (port === 0x2 || port === 0x3) {
        state.width = readShort(yakuState, 0x2) || DEFAULT_WIDTH;
    } else if (port === 0x4 || port === 0x5) {
        state.height = readShort(yakuState, 0x4) || DEFAULT_HEIGHT;
    } else if (port === 0x6) {
        state.auto = deviceRead([Screen + 0x6], 1, yakuState);
    } else if (port === 0x8 || port === 0x9) {
        state.x = readShort(yakuState, 0x8);
    } else if (port === 0xa || port === 0xb) {
        state.y = readShort(yakuState, 0xa);
    } else if (port === 0xc || port === 0xd) {
        state.addr = readShort(yakuState, 0xc);
    } else if (port === 0xe) {
        state.lastPixelCommand = {
            x: state.x,
            y: state.y,
            value: deviceRead([Screen + 0xe], 1, yakuState)
        };
    } else if (port === 0xf) {
        state.lastSpriteCommand = {
            x: state.x,
            y: state.y,
            addr: state.addr,
            value: deviceRead([Screen + 0xf], 1, yakuState)
        };
    }

    state.events.push({ kind: "DEO", port, size: sz });
    createCanvasPrototype(state);
}

export function screen_dei(args,sz,yakuState) {
    const state = getScreenState(yakuState);
    state.events.push({ kind: "DEI", port: args[0] & 0xf, size: sz });
    return deviceRead(args,sz,yakuState);
}
