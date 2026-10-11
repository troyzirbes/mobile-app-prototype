# Spark states and actions

This document is the product source for the case-study demo. It describes the state a person lands in on first download, the relationship states after that, and when each action is available.

The demo runs on the device. Profiles, likes, voice notes, co-op results, and chats are local. Registration, login, SMS, password reset, photo upload, payments checkout, and contact with real people are out of scope.

## First download

A new install, and **Reset Demo State**, both open this snapshot. The app lands on **Discover**. A card labeled **First download** stays up until the person taps **Start from here**.

| | |
| --- | --- |
| Person | Alex, 29. Woman seeking men, ages 26–40. Interests: night markets, climbing, cooking, live music. |
| Membership | Paid demo. Energy cap 150. |
| Energy | 80. One token returns each minute from the moment the state is created. Paid and free use the same speed. |
| Track | Commonalities. |
| Incoming likes | Jordan Hale, 31. Andre Brooks, 33. |
| Learning Stage | Empty. |
| Chats | Empty. |
| Attention gate | On. Cap of 2 chats. Turning the cap on also turns Incognito on when the cap is reached. |
| Incognito | Off. |
| Blind audition | Off. Photos are visible. |
| Vibe | None. |
| Challenge | Available. The 24-hour limit has not been used. |

The free-cap control on **You** changes only the energy maximum, from 150 to 100. Attention gate, blind audition, vibes, and the Exploration track stay available in this demo so the case study can show them without a checkout.

## Relationship states

A person is in one of these states. Discover hides anyone who is already in Incoming likes, the Learning Stage, or an active chat.

| State | What it means | How it starts | How it ends |
| --- | --- | --- | --- |
| Stranger | Shown on Discover when age and identity match both ways, and the track rules pass. | Default for the deck. Also the result of Disallow. | Like, Like + note, or an incoming like. |
| Incoming like | They liked Alex. Messaging is closed. | First download seeds two. **Simulate Incoming Like** adds another local match. | Reciprocate moves them to the Learning Stage. |
| Learning Stage | Both people have liked. Voice notes and co-op are available. Messaging is still closed. | Reciprocate, or Like / Like + note from Discover. A Discover like is answered locally, so the other person likes back into this stage. | Allow opens a chat. Disallow returns both people to strangers. |
| Active chat | Messages can be sent. | Allow, when the attention gate has room. **Fill Attention Gate** can also open chats for the case study. | Close removes the chat. It does not return the person to the Learning Stage. |

Skip on Discover only shows the next card during this visit. It spends nothing and stores nothing.

## When actions are available

### Discover

| Action | Available when | Result |
| --- | --- | --- |
| Choose a track | Always. Tracks: Aesthetic, Commonalities, Activities, Random, Exploration. | The deck changes. Local residents and explorers never share a track. |
| Filter a style | Aesthetic is selected. | Deck narrows to Athletic, Alternative, Minimalist, High-Fashion, or Outdoorsy. All shows every local match. |
| Set travel dates | Exploration is selected. | Only explorers whose dates overlap the window appear. With no window, the deck is empty. |
| Shuffle wildcards | Random is selected. | Order changes. The name stays hidden until Reveal wildcard. |
| Reveal wildcard | Random, before the name is revealed. | Like, note, co-op, and challenge become available for that card. |
| Play a voice note | A card is on screen, including a hidden wildcard. | If blind audition is on, that person's photos reveal. |
| Like · 10 | A revealed card is on screen, and energy is at least 10. | Spends 10. Moves them to the Learning Stage. Does not open a chat. |
| Like + note · 30 | A revealed card is on screen. Send is available once the note has text, and energy is at least 30. Cancel closes the sheet and spends nothing. | Spends 30. Same Learning Stage result as Like. |
| Co-op scenario | A revealed card is on screen. | Three choices. The other person's answer appears after 2 seconds. Finishing reveals photos when blind audition is on. |
| Challenge authenticity | A revealed card is on screen, and no challenge was started in the last 24 hours. | Starts a 60-second task: Palm, then Two fingers, then Wave. Starting uses the daily challenge. Passing adds Recently Verified for 24 hours. Time running out leaves no badge. |
| Skip for now | A card is on screen. | Next card. No energy cost and no relationship change. |

Commonalities shows a lifestyle overlap score. Activities shows that person's date bounty. Ages must sit inside both people's ranges, and each identity must be one the other is seeking. Everyone in the deck is 21 or older.

### Likes

| Action | Available when | Result |
| --- | --- | --- |
| Reciprocate · 10 | That person is in the incoming queue, and energy is at least 10. | Spends 10. Moves them to the Learning Stage. Does not open a chat. |

There is no pass on an incoming like. The like stays until it is reciprocated.

### Learning Stage

| Action | Available when | Result |
| --- | --- | --- |
| Play a voice note | That person is in the Learning Stage. | Marks the note heard. Reveals photos when blind audition is on. |
| Co-op scenario | That person is in the Learning Stage. | Same three-choice scene as Discover. Finishing reveals photos when blind audition is on. |
| Allow | That person is in the Learning Stage, and the attention gate is off or the open-chat count is under the cap. | Opens a chat with one greeting from them. Removes them from the Learning Stage. |
| Disallow | That person is in the Learning Stage. | Removes them. Both people are strangers again. Energy is not returned. |

When the gate is on and the cap is full, Allow does not open a chat. If auto Incognito is on, Incognito turns on at the same time.

A vibe set to **2h · Learning Stage** is shown on this screen until it expires. A vibe set to **4h · map off** is saved and stays off the screen.

### Chats

| Action | Available when | Result |
| --- | --- | --- |
| Open a thread | At least one chat exists. | Shows that thread. |
| Send | The draft has text. | Adds Alex's message. A local reply arrives shortly after. |
| Back | A thread is open. | Returns to the list. The chat stays open. |
| Close | A thread is open. | Removes the chat and frees a slot on the attention gate. Incognito stays as it was. |

### You

| Action | Available when | Result |
| --- | --- | --- |
| Switch to free cap (100) or paid cap (150) | Always. | Changes the maximum. Energy above the new maximum is lowered to it. Regen speed stays one token per minute. |
| Enable or disable the chat cap | Always. | Controls whether Allow can be blocked by the number of open chats. |
| Cap 1 or Cap 2 | Always. | Sets the maximum open chats used by the gate. |
| Incognito | Always. | Flips the status. While on, Discover says a live profile is not being shown. The deck, likes, and chats stay usable. |
| Blind audition | Always. | While on, photos render as avatars until that person has a heard voice note or a finished co-op. |
| 2h · Learning Stage | Always. Uses the text in the field. | Status lasts 2 hours and shows on the Learning Stage. |
| 4h · map off | Always. Uses the text in the field. | Status lasts 4 hours and is not shown. |
| Clear vibe | Always. | Removes the status. |

### Low energy

Like, Reciprocate, and Like + note wait until energy covers the cost. Regen can happen before the check. The relationship does not change, and the failed attempt shows how much energy is still needed.

## Demo controls

These sit on every screen for the case study. They are not product actions.

| Control | Result |
| --- | --- |
| +20 Energy / −20 Energy | Moves energy by 20, staying inside 0 and the current cap. |
| Simulate Incoming Like | Adds the next local mutual match to Incoming likes. |
| Fill Attention Gate | Opens chats up to the cap and turns Incognito on when the cap is reached. |
| Reset Demo State | Clears the saved session and returns to the first-download snapshot, including the First download card. |
