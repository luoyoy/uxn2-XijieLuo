# Uxn-2 Yaku Graphics Work Plan

## Project aim

Extend the JavaScript web version of Yaku so that it can display graphical output from Uxn/Uxntal programs by implementing support for the Varvara Screen device.

## MVP scope

The minimum viable product is a fixed-size browser canvas or popup graphics window that supports enough of the Varvara Screen device to display simple non-interactive graphical output.

Core features:

- Screen device dispatch through `DEO` and `DEI`.
- `Screen/width` and `Screen/height`.
- `Screen/x` and `Screen/y`.
- `Screen/pixel`.
- Basic `Screen/addr`.
- Basic `Screen/sprite`.
- Simple canvas/window rendering.

Optional features:

- Foreground/background layer refinement.
- Basic palette handling.
- `Screen/auto`.
- Simple animation via `Screen/vector`.
- Basic resize support.
- Mouse/keyboard support only if the core implementation is finished early.

## Timeline

### Week 1: 22 Jun - 28 Jun

- Attend first formal meeting.
- Understand project scope and supervisor expectations.
- Read the project brief.
- Read introductory material on Uxn, Uxntal, Varvara, Yaku, uxn5 and learn-uxn.

### Week 2: 29 Jun - 5 Jul

- Clone the `for-uxn-2-project` branch.
- Run `yaku_js/web` locally with `python3 -m http.server`.
- Create and share the Git repository.
- Inspect `app.js`, `Yaku.js`, `Actions.js`, `Access.js` and `Screen.js`.
- Compare `uxn5` and `learn-uxn`.
- Finalise the MVP scope.

### Week 3: 6 Jul - 12 Jul

- Implement Screen device dispatch for ports `0x20-0x2f`.
- Create a basic Screen state object.
- Create a popup window or canvas for graphical output.
- Preserve existing text output behavior.

### Week 4: 13 Jul - 19 Jul

- Implement `Screen/width` and `Screen/height`.
- Implement `Screen/x` and `Screen/y`.
- Implement basic `Screen/pixel`.
- Add simple fallback colours or basic palette support.
- Prepare first visual demo for the supervisor meeting on 16 July.

### Week 5: 20 Jul - 26 Jul

- Improve pixel drawing.
- Add foreground/background layer support if straightforward.
- Implement basic redraw/update logic.
- Prepare for sprite support.
- Review optional features and decide which are realistic before 6 August.

### Week 6: 27 Jul - 2 Aug

- Implement `Screen/addr`.
- Implement basic `Screen/sprite`.
- Render simple 8x8 sprite data from Uxn memory.
- Start dissertation writing: introduction, background and design notes.

### Week 7: 3 Aug - 9 Aug

- Prepare the MVP demo for the in-person meeting on 6 August.
- Fix major graphics bugs.
- Confirm with the supervisor whether the MVP is sufficient.
- Attempt small optional features only if the MVP is already stable.

### Week 8: 10 Aug - 16 Aug

- Run functional tests.
- Collect screenshots.
- Document limitations.
- Write implementation and evaluation sections.

### Week 9: 17 Aug - 23 Aug

- Show stable MVP and test evidence at the 20 August meeting.
- Confirm final evaluation and limitations with the supervisor.
- Complete most of the dissertation draft.

### Week 10: 24 Aug - 30 Aug

- Polish dissertation structure and writing.
- Prepare architecture diagram, screenshots and test result tables.
- Update README and repository documentation.

### Week 11: 31 Aug - 6 Sept

- Prepare viva/demo for 3 September.
- Proofread dissertation.
- Make only critical code fixes.
- Ensure Git history and project tracker are up to date.

### Week 12: 7 Sept - 11 Sept

- Final formatting.
- Check references, captions, figures, appendix and repository link.
- Submit dissertation within the official deadline window.
