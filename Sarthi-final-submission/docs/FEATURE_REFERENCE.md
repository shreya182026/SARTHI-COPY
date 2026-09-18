# Sarthi - App Working Reference (PPT base)

## Product idea
Sarthi helps a traveller find the journey that fits the situation. It compares practical options, explains trade-offs, communicates uncertainty, adapts when conditions change, and provides support during a journey.

## 1. Enter and personalise
- Welcome: Sign Up / Log In / Guest + language choice.
- Sign Up: phone -> OTP simulation -> language -> profile -> permission explanation -> guided Sarthi tour.
- Log In: phone -> OTP simulation -> permission explanation -> Home; existing saved profile is reused when present.
- Guest: can explore planning, but history is not permanently saved.
- Profile: name, age, career, optional income, walking comfort, accessibility and travel preferences.
- Language: 2-3 likely choices first; entire UI is designed around centralized i18n; language editable in Settings.
- Sarthi tour: Plan, Travel & Adapt, Support/Emergency, Offline journey; can skip and replay.

## 2. Home
Four main portals:
- New Journey
- My Journeys
- Frequent Journeys
- Emergency & Safety
Also: compact location map, Sarthi assistant, Trusted Contacts shortcut, Reports shortcut, Settings.

## 3. Plan and choose journey
- Travel Right Now or Pre-Journey.
- Start point and destination with suggestions; map preview; address/landmark/map-pin concept.
- Travel mode: We decide, Walk, Metro, Bus, Auto, Cab, Personal.
- Journey Priorities use Most Important / Important / Not Important.
- Priority examples: fastest, cheapest, lower walking, fewer transfers, public activity, lighting continuity, visibility, accessibility, predictability, weather exposure, connectivity and help access.
- “Not important” never means the factor is ignored when materially relevant.
- Route results: 2-4 practical options, comparison, Why This Route?, time/cost/walking/transfers, confidence and freshness.
- Confidence: High / Moderate / Limited. No fake safety percentages.
- Data gaps/conflicts are surfaced instead of invented.

## 4. Travel and adapt
- Start Journey activates live location only for the active journey.
- Journey Capsule is prepared immediately: essential route, steps, checkpoints, help points, destination, emergency contacts/helplines, legitimate vehicle/provider details, timestamps and last sync.
- Live Journey: map, current step, next step, progress, battery, connectivity, help, emergency.
- Major step confirmations are lightweight.
- “Something Changed” asks before re-evaluating; no silent rerouting.

## 5. R2 low-connectivity support
Situation: battery falls / internet becomes unstable / internet disappears.
- 40%: Low-Power Journey Mode starts and essential data is already prepared.
- 20%: brief contact status update.
- 10%: stronger battery warning.
- 5%: critical mode, essentials only.
- Low-power sharing contains status + location + journey map/link.
- First meaningful connectivity instability triggers an awareness update where communication is available.
- Offline screen: route, checkpoints, help points, destination, current/last known location, last synced time, and compact check-in.
- Compact check-in: I'm OK / Delayed / Need Help / Emergency.
- When connection returns: Journey synced; pending events can sync.
- Never claim remote delivery while truly offline.

## 6. Emergency and support
Four core actions:
- Share Location
- Get to Safety
- Contact Trusted Person
- Emergency Information / 112
Emergency map contains planned route, last known/current location and destination, with help points where available.
- External Google Maps navigation can be opened for navigation; Sarthi retains the secure context page.
- Trusted contacts: minimum 5; primary/priority contact supported.
- Contacts can use a temporary secure browser link without the app.
- Link expires when journey ends.

## 7. Progressive journey-stop support
Situation: journey meaningfully stops without explanation.
1. Ask: “Are you okay?”
2. After a light early window (~1-2 min), send a light contact buzz.
3. If unresolved and still stopped (~5-10 min, shorter in unusual/night context), stronger emergency escalation.
4. Traffic/context can explain a delay; do not treat every stop or network fluctuation as an emergency.

## 8. Ultimate emergency mode
- Manual trigger is represented in the prototype as an emergency shortcut; a native build can later wire to supported hardware/OS triggers such as repeated power-button action.
- Activation opens urgent support, alerts all emergency contacts and provides emergency context.
- Context can include location, destination, time, last movement, mode, legitimate vehicle/provider details, traffic/weather/connectivity, nearest police station/helplines, help points and secure link.
- Cancellation requires a secret code known to the traveller and trusted contacts; forgotten-code flow relies on contacting a trusted person.
- Do not auto-call police solely from an AI inference.

## 9. Get to Safety
Options are ranked by distance, availability and currently available context:
- police station
- hospital
- verified help point
- open public place / staffed establishment
- configured trusted-person location when explicitly available
Use “recommended based on available information”, not “guaranteed safe”.

## 10. Reports and resolution review
- Report journey/context issue.
- Add evidence such as photo, text and timestamp.
- Review states: Verified / Under Review / Questionable / Outdated.
- Users can flag questionable or outdated proof.
- If an issue remains, Reopen it.
- This workflow stays connected to journeys rather than becoming a separate complaint app.

## 11. Finish and My Journeys
- Journey completion ends live tracking and invalidates the temporary link.
- Save journey summary: time, cost, walking, modes, transfers, events, changes, check-ins and feedback.
- My Journeys uses a calendar, details, timeline and replay.
- Frequent Journeys are suggested from recurring patterns.

## 12. Settings
Only user-facing controls belong here:
- Personal information
- Language
- Journey Preferences / Priorities
- Accessibility
- Emergency Contacts
- Notifications
- Location & Privacy
- Sarthi tour replay
No challenge labels or internal round terminology should appear in the normal Settings experience.

## 13. Product guardrails
Never claim “100% safe”, “safe route”, “dangerous area”, “crime score”, predictive crime detection, facial recognition, live crowd surveillance, or inherent community/area danger. Sarthi is a journey-fit companion, not a safety authority.

## 14. Prototype vs real product
Prototype uses realistic mock data for route/context, battery, connectivity and emergency simulations. Real product integrations can later connect to maps, weather, transport, authentication, database/cloud storage, push/SMS, secure links and native battery/hardware capabilities.
