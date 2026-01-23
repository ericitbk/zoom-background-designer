# MF Virtual Background Generator

Generate polished Zoom backgrounds with a branded layout, user info, and a QR code for LinkedIn/Notion. The app previews changes in real time and exports a high-resolution image suitable for video calls or screensavers.

## Features

- curated MF background presets
- configurable text block (name, position, division, quote/phrase)
- dynamic overlay + text color adjustments for contrast
- QR code rendering with padding and alignment per layout
- high-resolution export canvas

## Local development

```sh
npm install
npm run dev
```

## Scripts

```sh
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
```

## Configuration

- Canvas dimensions are defined in `src/lib/constants.ts`.
- Background assets live in `src/assets/` and are registered in `src/components/BackgroundSelector.tsx`.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- QRCode generator
