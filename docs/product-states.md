# Spark states and actions

Case-study demo. Everything stays on the device. Registration, login, SMS, payments, photo upload, and a live map are out of scope.

## Where a first open lands

Launch, and **Reset State**, open **Demo Intro**. **Let's go!** continues to Home as Alex, with paid features unlocked.

| | |
| --- | --- |
| Energy | 80 of 100. One token returns every 30 minutes. |
| Incoming likes | Jordan Hale and Andre Brooks, on Interested. Reciprocate costs 0. |
| Exploring | Empty. |
| Connections | Empty. |
| Attention gate | On, cap of 2. A full cap turns Incognito on. |
| Daily likes | Cap of 18 for likes you send. |

## Navigation

The bottom bar changes with the screen. The section you are already in is left off the discovery bar.

| Screen | Bar |
| --- | --- |
| Intro | No contextual bar. The demo controls stay. |
| Home, App Info | Profile, Likes & Connections, App Info |
| Aesthetic, Commonalities, Activities, Adventure, Location | Home and the other four tracks |
| My Profile, Likes & Connections | Home, Interested, Exploring, Connections |

Demo controls on every screen: +20 Energy, −20 Energy, Simulate Like, Reset State.

## Relationship states

| State | Meaning | How it starts | How it ends |
| --- | --- | --- | --- |
| Stranger | On a search track when age and identity match both ways. | Default. Also Disallow, Pass, or Skip. | Like, Like + intro, or an incoming like. |
| Interested | They liked Alex. | First open seeds two. Simulate Like adds another local match. | Reciprocate moves them to Exploring and spends 0 energy. Pass removes them. |
| Exploring | Both people opted in. Messaging is closed. | Reciprocate, a search-track like while Like + Exploring is on, or an Adventure intent. | Allow opens a chat when the cap has room and direct contact is on. Disallow returns to strangers. |
| Connection | Messages are open. | Allow. | Close removes the chat and frees a cap slot. |

A like from a search track costs 10. An intro note costs 30. Those are the only energy spends for a relationship. Skip hides someone for 30 days. Block removes them on this device.

## Search tracks

| Track | What you do | Result |
| --- | --- | --- |
| Home | Spin the five styles, press the front one, or type a style and Update. | Opens that track. |
| Aesthetic | Pick style tags, Update. | Avatar grid. A person opens their profile. |
| Commonalities | Pick hobbies, Update. | Overlap scores, or overlapping circles when two or more tags are on. |
| Activities | Pick hobbies, Update. | Date bounties, drawn as overlapping circles when two or more tags are on. |
| Adventure | Read the rules, Let's go, answer a prompt. | Another round, stop, or save Chat / Dates / IRL Friends into Exploring. |
| Location | Optional status and a date window. | Residents on the sketch map. Visitors only in the explorer row, and only when their dates overlap. |

Age and identity have to fit both people. Residents and visitors never share a track.

## Profile actions

On someone else's profile: Like · 10, Intro · 30, Skip 30 days, Block, voice notes, co-op, and Challenge authenticity. A challenge can start once every 24 hours. Passing adds Recently Verified for 24 hours. Starting the challenge uses that day even if time runs out.

On My Profile: bio, a voice intro saved locally, Adventure, Location, the daily like cap, Like + Exploring, Direct contact, blind audition, Incognito, and the chat cap. Pause stops new likes. Delete clears the device and returns to the intro.

Blind audition keeps photos as a placeholder until a voice note or co-op for that person is finished.

## When an action waits

| Action | It waits when |
| --- | --- |
| Like or intro | Energy is below the cost, discovery is paused, or the daily like cap is used up. |
| Allow | They are not in Exploring, direct contact is off, or the chat cap is full. A full cap with auto Incognito turns Incognito on and does not open the chat. |
| Challenge | One was started in the last 24 hours. |
| Location visitors | No date window overlaps their trip. |
