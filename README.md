# mobile-app-prototype

Local dating demo for a product case study. The first open lands on Alex, a paid profile already on the device. Two likes are waiting, the Learning Stage is empty, and there are no chats. Likes, voice notes, co-op scenarios, and chats are generated on the device. Nothing is sent to a server.

Registration, login, SMS, and account recovery are out of scope. States, actions, and when each action is available are written in [docs/product-states.md](docs/product-states.md). Reset Demo State returns to that first download.

Energy regenerates once a minute. A like costs 10. A like with a note costs 30. Liking someone back puts them in the Learning Stage. Allow opens a chat. Disallow sets you both back to strangers.

The demo controls along the bottom can add or spend energy, inject a local like, fill the attention gate, or reset the saved state.

## Run

```bash
npm install
npm run web
```

`npm start` opens the Expo dev server for a device or simulator. `npm test` checks the swipe rules, matching, and energy rules. `npm run typecheck` runs the TypeScript compiler.
