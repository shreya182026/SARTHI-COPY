# Sarthi — Feature Map & Situation Reference

This file is the product reference for the prototype. It intentionally avoids presenting challenge labels (R1/R2) or internal terminology in the normal app UI.

## 1. Entry and onboarding
Situation: first-time user.
Flow: Welcome → Sign Up / Log In / Guest → phone → simulated OTP → language → profile → permissions → Sarthi tour → Home.
OTP demo: 123456.
Language: English, Hindi, Hinglish; centralized selection and change later.
Profile: name, age, career, optional income, walking comfort, accessibility.

Situation: returning user.
Flow: saved profile → Home.

Situation: guest.
Can plan/compare journeys; no permanent journey history.

## 2. Home
New Journey, My Journeys, Frequent Journeys, Emergency & Safety, compact map, Sarthi assistant, Settings at bottom.

## 3. Journey planning
Two modes: Travel Right Now and Pre-Journey.
Starting point defaults to current location but can be changed. Destination supports search/suggestions/pin-style demo. Travel modes include multimodal choices. Journey Priorities use Most Important / Important / Not Important rather than numeric sliders.

## 4. Context-aware comparison
Show 2–4 practical routes. Each card: time, cost, walking, transfers, modes, recommendation reason, confidence, freshness. Never claim a route is guaranteed safe. "Why this route?" explains the trade-off. Data quality uses freshness/confidence language.

## 5. Context change
Situation: a meaningful route/context change occurs.
Show "Something Changed" → explain what changed → user chooses Re-evaluate or Keep Current Journey. Never silently reroute.

## 6. Live journey
Map-first screen, route progress, step completion, battery and connectivity status, emergency access, help/report, Sarthi.
Live sharing exists only during the active journey.

## 7. Journey Capsule / offline support
At journey start, prepare essential route/map information, checkpoints, help points, destination, emergency information, provider/vehicle info when legitimately available, timestamps and last sync.
Offline state: show last known/present location where possible, essential route and help points, compact check-in, and Last synced time.
Back online: Journey synced.

## 8. Battery
40%: low-power journey mode.
20%: brief trusted-contact update.
10%: stronger battery warning.
5%: critical low-battery mode; preserve only essential journey/help/emergency functions.
Contact update content: status + location + journey map/link.

## 9. Connectivity
Normal → Unstable → Low → Offline → Back Online.
First meaningful instability triggers an explanation and offline preparation. Connectivity fluctuation alone is not an emergency. If offline, the app never claims a new remote update was delivered unless it actually could be.

## 10. Journey-stop escalation
Meaningful unexplained stop → "Are you okay?" → light trusted-contact buzz after a short unresolved interval → stronger escalation if the stop continues and no response. Traffic/context can reduce false alarms. Demo timing is accelerated for prototype.

## 11. Emergency & Safety
Four main actions: Share Location, Get to Safety, Contact Trusted Person, Emergency / 112.
Emergency map shows planned route, actual/last-known path, current/last-known location, destination, last sync and available context. "Open in Google Maps" is treated as an external navigation handoff.

## 12. Trusted contacts
At least five contacts. During sharing, selected contacts can receive configured status/location/map-link updates. During urgent activation, configured emergency contacts receive context-rich alerts. Contacts can use a secure browser journey link; they do not need the app.

## 13. Ultimate emergency mode behaviour
Manual emergency activation is represented in the prototype through the emergency action. Native hardware shortcuts (such as a physical 3× power-button trigger) require a future native mobile implementation. Emergency activation includes an emergency screen, contact alerts, map/context, nearby help, and secret-code cancellation concept.

## 14. Get to Safety
Rank nearby legitimate options such as police help points, hospitals, verified help points and reliable public places using distance/availability/context. Avoid guarantees of safety.

## 15. Reporting and review
Report → attach evidence → review → Verified / Questionable / Outdated → Resolved / Reopen. Users can flag false or stale resolutions.

## 16. Completion and history
Journey completion: summary, feedback, save to My Journeys, live sharing off, temporary link invalidated. My Journeys provides calendar and journey replay/detail.

## 17. Settings
Only user-facing controls: profile/personal information, language, Journey Priorities, accessibility/walking comfort, trusted contacts, privacy/notifications and Sarthi tour replay. Internal challenge labels are deliberately not shown as settings categories.

## 18. Prototype boundaries
Maps, routing, transport, weather, SMS, push notifications, exact battery APIs, native hardware triggers and secure backends are simulated or represented with mock services where live credentials/APIs are not available. The product UI must not pretend these external integrations are real when they are not.
