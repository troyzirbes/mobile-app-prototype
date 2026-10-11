# mobile-app-prototype

Local dating demo. Spark opens straight into a paid demo profile. Likes, voice notes, co-op scenarios, and chats are generated on the device. Nothing is sent to a server, and there is no login.

Energy regenerates once a minute. A like costs 10. A like with a note costs 30. Liking someone back puts them in the Learning Stage. Allow opens a chat. Disallow sets you both back to strangers.

The demo controls along the bottom can add or spend energy, inject a local like, fill the attention gate, or reset the saved state.

## Run

```bash
npm install
npm run web
```

`npm start` opens the Expo dev server for a device or simulator. `npm test` checks the swipe rules, matching, and energy rules. `npm run typecheck` runs the TypeScript compiler.
