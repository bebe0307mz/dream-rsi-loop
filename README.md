# Dream-RSI Loop

Animated step-by-step visualization of the Dream-RSI recursive self-improvement loop. Watch an AI agent build its own training worlds to get smarter, generation by generation.

**Live:** [dream-rsi-loop.vercel.app](https://dream-rsi-loop.vercel.app)

## Features

- Animated diagram of the full RSI cycle: Agent -> World Generation -> Training -> Eval -> Next Agent
- Step-by-step breakdown with plain-English captions synced to each loop iteration
- Loop counter that increments as the animation runs, showing generations accumulating
- One-click "Copy tweet + GIF" export using html2canvas + gif.js
- Dark-mode-first, mobile-friendly, screenshot-ready at every frame

## Stack

- Next.js 14 (static export)
- Framer Motion
- Tailwind CSS
- html2canvas + gif.js for GIF export
- Zero backend

## Development

```bash
npm install
npm run dev
```

## Based on

[Dream-RSI: Recursive Self-Improvement through Evolving Worlds](https://github.com/zhengkid/Dream-RSI)
