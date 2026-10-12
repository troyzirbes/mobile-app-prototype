# mobile-app-prototype

Local dating demo for a product case study. The first screen is a demo intro. Let's go opens Home as Alex, with paid features unlocked, 80 of 100 energy, and two likes waiting. Search tracks, Exploring, and chats are generated on the device. Nothing is sent to a server.

Registration, login, and SMS are out of scope. States, actions, and the contextual bottom bar are written in [docs/product-states.md](docs/product-states.md). Reset State returns to the intro.

Energy regenerates once a minute. A like costs 10. A like with a note costs 30. Liking someone back puts them in the Learning Stage. Allow opens a chat. Disallow sets you both back to strangers.

The demo controls along the bottom can add or spend energy, inject a local like, fill the attention gate, or reset the saved state.

## Run

```bash
npm install
npm run web
```

`npm start` opens the Expo dev server for a device or simulator. `npm test` checks the swipe rules, matching, and energy rules. `npm run typecheck` runs the TypeScript compiler.
