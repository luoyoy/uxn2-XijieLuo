"use strict";

const VERSION = "1.0.0";

import { deviceRead, deviceWrite } from "./Access.js";

export const Screen = 0x20;

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 240;
const MAX_DIMENSION = 1024;
const PALETTE = ["#ffffff", "#c8c8c8", "#666666", "#000000"];

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
            backgroundLayer: null,
            foregroundLayer: null,
            bufferWidth: 0,
            bufferHeight: 0,
            events: []
        };
    }
    ensureLayerBuffers(yakuState.screenState);
    return yakuState.screenState;
}

function readShort(yakuState, port) {
    return deviceRead([Screen + port], 2, yakuState);
}

function normaliseDimension(value, fallback) {
    if (!Number.isFinite(value) || value <= 0) {
        return fallback;
    }
    return Math.min(Math.floor(value), MAX_DIMENSION);
}

function ensureLayerBuffers(state) {
    const width = normaliseDimension(state.width, DEFAULT_WIDTH);
    const height = normaliseDimension(state.height, DEFAULT_HEIGHT);

    if (
        state.backgroundLayer &&
        state.foregroundLayer &&
        state.bufferWidth === width &&
        state.bufferHeight === height
    ) {
        return;
    }

    state.width = width;
    state.height = height;
    state.bufferWidth = width;
    state.bufferHeight = height;
    state.backgroundLayer = new Uint8Array(width * height);
    state.foregroundLayer = new Uint8Array(width * height);
}

function getCanvasElements() {
    if (typeof document === "undefined") {
        return { canvas: null, status: null };
    }

    let canvas = document.getElementById("yaku-screen-prototype");
    let status = document.getElementById("yaku-screen-status");
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

        status = document.createElement("p");
        status.id = "yaku-screen-status";
        status.style.fontFamily = "monospace";

        wrapper.appendChild(title);
        wrapper.appendChild(canvas);
        wrapper.appendChild(status);
        document.body.appendChild(wrapper);
    }

    return { canvas, status };
}

function renderScreen(state) {
    ensureLayerBuffers(state);
    const { canvas, status } = getCanvasElements();
    if (!canvas) {
        return;
    }

    canvas.width = state.width;
    canvas.height = state.height;
    canvas.style.width = `${state.width * 2}px`;
    canvas.style.height = `${state.height * 2}px`;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(state.width, state.height);

    for (let i = 0; i < state.width * state.height; i++) {
        const fg = state.foregroundLayer[i];
        const colorIndex = fg === 0 ? state.backgroundLayer[i] : fg;
        const hex = PALETTE[colorIndex] || PALETTE[0];
        const offset = i * 4;
        imageData.data[offset] = parseInt(hex.slice(1, 3), 16);
        imageData.data[offset + 1] = parseInt(hex.slice(3, 5), 16);
        imageData.data[offset + 2] = parseInt(hex.slice(5, 7), 16);
        imageData.data[offset + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    ctx.strokeStyle = "#999999";
    ctx.strokeRect(0, 0, state.width - 1, state.height - 1);

    if (status) {
        status.textContent = `size=${state.width}x${state.height}, x=${state.x}, y=${state.y}, addr=0x${state.addr.toString(16)}, events=${state.events.length}`;
    }
}

function drawPixelToLayer(state, x, y, colorIndex, useForeground) {
    ensureLayerBuffers(state);

    if (x < 0 || y < 0 || x >= state.width || y >= state.height) {
        return;
    }

    const index = y * state.width + x;
    const layer = useForeground ? state.foregroundLayer : state.backgroundLayer;
    layer[index] = colorIndex & 0x03;
}

function drawPixelCommand(state, value) {
    const colorIndex = value & 0x03;
    const useForeground = (value & 0x40) !== 0;

    if ((value & 0x80) !== 0) {
        const flipX = (value & 0x10) !== 0;
        const flipY = (value & 0x20) !== 0;
        const startX = flipX ? 0 : state.x;
        const endX = flipX ? state.x + 1 : state.width;
        const startY = flipY ? 0 : state.y;
        const endY = flipY ? state.y + 1 : state.height;

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                drawPixelToLayer(state, x, y, colorIndex, useForeground);
            }
        }
        return;
    }

    drawPixelToLayer(state, state.x, state.y, colorIndex, useForeground);
}

function readMemoryByte(yakuState, addr) {
    const token = yakuState.Uxn.memory[addr];
    if (!token || typeof token[1] !== "number") {
        return 0;
    }
    return token[1] & 0xff;
}

function drawSpriteCommand(state, yakuState, value) {
    const useForeground = (value & 0x40) !== 0;
    const flipY = (value & 0x20) !== 0;
    const flipX = (value & 0x10) !== 0;
    const colorIndex = value & 0x03;
    const visibleColor = colorIndex;

    for (let row = 0; row < 8; row++) {
        const sourceRow = flipY ? 7 - row : row;
        const rowByte = readMemoryByte(yakuState, state.addr + sourceRow);
        for (let col = 0; col < 8; col++) {
            const sourceCol = flipX ? col : 7 - col;
            const bitIsSet = ((rowByte >> sourceCol) & 0x01) !== 0;
            if (bitIsSet) {
                drawPixelToLayer(state, state.x + col, state.y + row, visibleColor, useForeground);
            }
        }
    }
}

export function screen_deo(args,sz,yakuState) {
    let dev_addr = args[0];
    let port = dev_addr & 0xf;
    deviceWrite(args,sz,yakuState);

    const state = getScreenState(yakuState);
    if (port === 0x2 || port === 0x3) {
        state.width = readShort(yakuState, 0x2) || DEFAULT_WIDTH;
        ensureLayerBuffers(state);
    } else if (port === 0x4 || port === 0x5) {
        state.height = readShort(yakuState, 0x4) || DEFAULT_HEIGHT;
        ensureLayerBuffers(state);
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
        drawPixelCommand(state, state.lastPixelCommand.value);
    } else if (port === 0xf) {
        state.lastSpriteCommand = {
            x: state.x,
            y: state.y,
            addr: state.addr,
            value: deviceRead([Screen + 0xf], 1, yakuState)
        };
        drawSpriteCommand(state, yakuState, state.lastSpriteCommand.value);
    }

    state.events.push({ kind: "DEO", port, size: sz });
    renderScreen(state);
}

export function screen_dei(args,sz,yakuState) {
    const state = getScreenState(yakuState);
    state.events.push({ kind: "DEI", port: args[0] & 0xf, size: sz });
    return deviceRead(args,sz,yakuState);
}
