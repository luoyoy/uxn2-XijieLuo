# Uxn-2 Progress Log: Weeks 1-3

This log records the early catch-up work for the Uxn-2 project. The current goal is not to complete the full graphics implementation yet, but to understand how Yaku works and make a small first prototype for the Screen device.

## Week 1: 22 Jun - 28 Jun

Main work:
- Attended the first project meeting and confirmed the project topic: `uxn-2 Graphics for web yaku`.
- Read the project guidance and identified the main task: add graphical output support to the web version of Yaku.
- Started reading about Uxn, Uxntal, Varvara devices, and the Screen device.
- Noted the main reference codebases mentioned in the project guidance: Yaku, uxn5, and learn-uxn.

What I understand so far:
- Yaku is an interpreter/assembler for Uxntal.
- Uxn programs communicate with devices through `DEO` and `DEI`.
- The Screen device uses ports in the `0x20-0x2f` range.
- For this project, the web version should eventually show graphical output in a canvas or separate window.

Current concerns:
- I still need more confidence reading the JavaScript codebase.
- I need to understand exactly where `DEO` and `DEI` are handled before attempting real graphics.

## Week 2: 29 Jun - 5 Jul

Main work:
- Set up the local Yaku project.
- Checked the web app files and identified the main browser entry point.
- Read the important files related to execution and devices:
  - `yaku_js/web/app.js`
  - `yaku_js/web/lib/Yaku.js`
  - `yaku_js/web/lib/Yaku/Uxntal/Actions.js`
  - `yaku_js/web/lib/Yaku/Varvara/Devices/Access.js`
  - `yaku_js/web/lib/Yaku/Varvara/Devices/Screen.js`
- Wrote a 12-week work plan focused on finishing the MVP before the in-person meeting.

Current architecture understanding:

Uxntal program
  -> interpreter executes instructions
  -> DEO / DEI handled in Actions.js
  -> device address decides which Varvara device is used
  -> Screen.js should handle ports 0x20-0x2f
  -> browser canvas should display the result

Decision:
- I will keep the first implementation small.
- I will first connect the Screen device to the existing device dispatch.
- After that I will implement width, height, x, y, pixel, and sprite gradually.

## Week 3: 6 Jul - 12 Jul

Main work:
- Added initial dispatch for the Screen device in `Actions.js`.
- Added a basic Screen state object in `Screen.js`.
- Added early handling for Screen ports such as width, height, x, y, addr, pixel, and sprite.
- Added a simple browser canvas prototype to confirm that Screen operations can reach the web interface.

Current implementation status:
- `DEO` and `DEI` can now route Screen device addresses to `Screen.js`.
- Screen state can store basic information.
- The browser can create a placeholder canvas when Screen output is used.

Not completed yet:
- Actual pixel drawing is not implemented yet.
- Actual 8x8 sprite rendering is not implemented yet.
- Palette, layers, animation, mouse, keyboard, and resize support are not implemented.

Next step:
- Week 4 will focus on `Screen/width`, `Screen/height`, `Screen/x`, `Screen/y`, and a first working version of `Screen/pixel`.
