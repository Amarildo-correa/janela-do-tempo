# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

"Janela do Tempo": a **Vega OS** (Amazon Fire TV) app in **React Native for Vega 0.83** (Vega SDK 2.0, Vega OS 2.0 minimum), developed from **Windows + WSL2**, where the Vega SDK is not officially supported. The app lives at the repo root and builds a `.vpkg`.

The development environment was set up and validated in `~/project/test-environment` (Hello World TV). Its `vega/` folder is the working reference for code patterns (D-pad focus in `src/focus/`, splash/TTFD hooks in `src/launch.ts`, navigation, tests), and `scripts/make-assets.mjs` there generates icons, splash zip and store images from SVG via `sharp`.

The general procedure (container, developer mode, CI, code rules, pitfalls) is in the user skill **`vega-os-windows`**; load it for any Vega task.

## State of the repo

The app exists and runs on the Fire Stick: package id `com.janeladotempo.app` (`app.json` name, `AppRegistry` name and the `manifest.toml` interactive component id are `com.janeladotempo.app.main`). One Home screen with the forecast for Novo Hamburgo (Open-Meteo, no key) and a Search screen that only says "Em desenvolvimento".

- Visual identity comes from the user's Design System artifact "Janela do Tempo" (README, VEGA.md, tokens.json); all values live in `src/theme.ts`.
- The user wants **only ready-made Amazon components**, nothing hand-rolled: Vega Carousel (`@amazon-devices/vega-carousel`) for the rails, `TVFocusGuideView`/`FocusManager`/`useTVEventHandler` from react-native-kepler, Ionicons from `@amazon-devices/react-native-vector-icons`, `@amazon-devices/react-linear-gradient` for the background. kepler-ui-components 3.x Button/Card/Typography are deprecated on RN 0.83; card contents and the button are RN `Pressable`/`Text`/`View`, as Amazon's migration guide says.
- Vega Carousel facts learned on the device: it does not emit onFocus/onBlur to JS (not even to a wrapping View), so the focused rail is tracked from ↑/↓ keys (`src/focus/useRegionFocus.ts`) and OK from `select` key events (`useSelectPressed`); its item stretches to the container height; its native press scale is anchored at the item's left edge and its selected-item scale stays on in an unfocused rail, so the card draws its own focus layer and press scale from the center (`src/components/FocusCard.tsx`, `useFocusAnimation`) with Carousel scale 1 and no `selectionBorder`; each item has `focus.room` (12 px) of slack so the 1.06 layer never covers neighbours (visible gap 32 px); `hasPreferredFocus` re-grabs focus when the screen comes back, so it is only on for the first visit.
- Fonts: Roboto SemiBold/Bold/ExtraBold and Ionicons in `assets/fonts/` (file name = fontFamily). Icon, splash and store images come from `scripts/make-assets.mjs` (`cd scripts && npm install && node make-assets.mjs`; needs Roboto installed in `~/.local/share/fonts`).
- `package.json` `name`/`kepler.appName` are `@amazon-devices/janeladotempo` / `JanelaDoTempo`.

## Commands

### JS checks (run in WSL)
```bash
source ~/.bashrc
npm install --legacy-peer-deps
npx tsc --noEmit && npm run lint && npx jest
npx jest test/App.spec.tsx                          # single test file
```

### Vega SDK
- **Release `.vpkg`**: pushing to `main` runs `.github/workflows/vega-build.yml` (installs SDK, `vega project install --fix`, `vega project doctor --rn-version 0.83`, tsc, lint, tests, `npm run build:release`). Download with `gh run download <id> -n janela-do-tempo-vpkg`. The Fire TV Stick uses the **armv7** package.
- **Vega SDK version**: 2.0.13986, pinned in `vega-build.yml` (`VEGA_SDK_VERSION`) and active in the container. Check for newer ones with `vega sdk list-remote`.
- **Vega CLI locally**: Docker container `vega-sdk-dl` (SDK in volume `vega-home`; `docker start vega-sdk-dl` if stopped), e.g. `docker exec vega-sdk-dl bash -c 'export PATH=/root/vega/bin:$PATH; vega ...'`. `vega devmode` commands need `source /root/vega/dbus.env` first (keyring).
- **Local doctor/build in the container** (Node 22 in `/root/vega/node22`; the repo is not mounted, copy the committed tree):
  ```bash
  docker exec vega-sdk-dl bash -c 'rm -rf /root/work && mkdir -p /root/work/janela-do-tempo'
  git archive HEAD | docker exec -i vega-sdk-dl tar -x -C /root/work/janela-do-tempo
  docker exec vega-sdk-dl bash -c 'export PATH=/root/vega/node22/bin:/root/vega/bin:$PATH; cd /root/work/janela-do-tempo && npm install --legacy-peer-deps && vega project doctor --rn-version 0.83 && npm run build:release'
  docker exec vega-sdk-dl bash -c 'ls /root/work/janela-do-tempo/build/armv7-release/'   # then docker cp the .vpkg out
  ```
- **Install on the physical Fire Stick** (developer mode already enabled; IP 192.168.1.3 since 2026-11-01, it changes when the router restarts — find it by scanning port 5555 on 192.168.1.0/24 from the container):
  `~/.claude/skills/vega-os-windows/scripts/vega-device.sh 192.168.1.3 <file.vpkg> com.janeladotempo.app`
  Remote keys may still go to the Fire TV launcher afterwards: relaunch on the device with `vlcm launch-app orpheus://<package id>.main` before sending keys.
- **See / drive / debug the TV** (`~/.claude/skills/vega-os-windows/scripts/vega-tv.sh`): `shot /tmp/tv.png` (1920×1080 screenshot to read), `key KEY_RIGHT KEY_ENTER KEY_BACK` (remote buttons), `logs <package id>` / `follow <package id>` (app logs). Works while the TV shows another input. A 0-byte/black shot usually means another app with DRM video (Fire TV launcher, Netflix) is in front: check `vlcm list` on the device.

## Vega rules (keep them when writing code)

- Packages are the Amazon forks (`@amazon-devices/react-navigation__native`, `__stack`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`). Navigation uses `createStackNavigator` (not native-stack) and the app is wrapped in `GestureHandlerRootView`; call `enableScreens()`/`enableFreeze()`.
- Keep D-pad focus logic in `src/focus/`. `hasTVPreferredFocus` only works on mount: to restore focus when a screen regains focus, keep refs and call `FocusManager.focus(findNodeHandle(ref))` inside `useFocusEffect`.
- Put the mandatory splash/TTFD hooks in their own module (`src/launch.ts`) and mock it in tests; the hooks break under Jest.
- No nested `<Text>` (use sibling `Text`s in a row `View`); memoize handlers/styles, there is no React Compiler.
- `onSubmitEditing` on the system keyboard: ignore `submitAction === 'previous'` (Back key, SDK 2.0); the `react-native` types lack `submitAction`, declare it locally.
- Jest (SDK 2.0 model): the `@amazon-devices/*` npm packages only ship types (their code is in the device's system bundles), so tests run on stock `react-native` (`preset: "react-native"`). `test/__mocks__/react-native-kepler.js` mocks the Vega APIs, `jest.config.json` maps each Amazon fork to the same-version upstream library (devDependencies), and `test/setup.js` pins `Dimensions` to 1920×1080. Add new Vega APIs to the mock when the app starts using them.
- Do not commit `package-lock.json` (a WSL lock breaks ESLint plugin resolution in CI); after a CI run, copy back the `package.json` that `vega project install --fix` aligned (artifact `vega-resolved-deps`).

## Amazon Devices Builder Tools (MCP)

`.adbt-config.json` maps the repo to `vega_os`. Before other ADBT MCP calls in a session, call `set_project_context` with that file's contents, then pass `target_platform` `{"device_os": ["vega_os"]}` to `search_documentation`/`list_documents`.

## Publishing

Store listing fields must not mention "Vega".
