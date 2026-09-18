# Sarthi Product Reference

## Identity
- App name: Sarthi.
- In-app guide/chatbot: Disha.
- Sarthi logo and Disha avatar are intentionally different visual identities.
- Core idea: “Find the journey that fits your situation.”
- User-facing route copy must not use numeric safety scores or guarantee safety.

## Section 1 - Enter & Personalise
1. Welcome: Sarthi identity, impactful statement, Get Started only.
2. Auth choice: Sign Up (recommended), Log In, Guest Mode; explain each.
3. Phone number: separate screen.
4. OTP: separate 6-digit simulation; demo OTP 123456.
5. Location: permission/explanation before language.
6. Language: 2–3 recommended choices based on location/device context, all remaining languages below.
7. Disha introduction: friendly companion introduction before profile questions.
8. Profile: name, age, career, optional income; one question at a time where practical; friendly info button beside each question.
9. Travel defaults: preferred modes, walking comfort and journey priorities saved once.
10. Guided tour: four complete steps introducing Plan, Travel & Adapt, Emergency & Safety, My Journeys; can skip and replay from Settings.
11. Dashboard: New Journey, My Journeys, Frequent Journeys, Emergency & Safety, compact map, Disha guide, Settings.

## Section 2 - Plan & Choose Journey
- Travel Right Now vs Pre-Journey.
- Pre-Journey captures date/time.
- Starting point defaults to current location but can be changed.
- Destination supports address/place/landmark search, map and fallback suggestions.
- Travel mode: Walk, Metro, Bus, Auto/Rickshaw, Cab, Bike/Scooter, Personal vehicle, multimodal/Let Sarthi decide.
- Saved walking comfort can be adjusted for this journey.
- Journey Priorities: Most Important / Important / Not Important; custom priority allowed.
- A “Not Important” factor may still materially affect a journey and should be explained.
- Route results: 2–4 practical route options, with time, cost, walking, transfers, modes, context, freshness and confidence.
- No numeric Journey Fit score shown to users.
- “Why This Route?” uses human-language trade-offs.
- Route details show first/last mile, steps, fingerprint, context, freshness and confidence.
- Compare routes side-by-side.
- User may adjust priorities after seeing routes.
- Choose journey -> preparation -> start.

## Section 3 - Travel & Adapt
- Live Journey begins only after Start Journey.
- Browser geolocation watches position while journey is active; last-known location used when live position unavailable.
- Live map, current step, next step, progress, battery, connectivity, help and emergency access.
- Lightweight major-step confirmation.
- Something Changed -> explain -> Re-evaluate or Keep Current; never silently reroute.
- Journey Capsule created at journey start and stores essential route/map data, steps, checkpoints, help points, destination, contacts, helplines, legitimate vehicle/provider details if available, timestamps and last-sync data.
- Battery thresholds: 40%, 20%, 10%, 5% with progressive low-power behaviour.
- Low-power sharing concept: status + location + journey map/link.
- Connectivity states: Normal, Unstable, Low Connectivity, Offline, Back Online.
- First meaningful instability triggers user awareness + offline preparation and awareness update when communication is available.
- Offline Journey keeps route, checkpoints, help points, destination, current/last-known location, emergency access and compact check-in.
- Compact check-in: I’m OK / Delayed / Need Help / Emergency.
- On reconnect: synchronize pending information and show Journey synced.

## Section 4 - Help / Emergency / Report / Finish
### Emergency Portal
- Share Location
- Get to Safety
- Contact Trusted Person
- Emergency Information / 112
- Emergency map with planned route, actual/last-known path where available, location, destination and help points.
- External Google Maps handoff for navigation.

### Trusted Contacts
- Minimum 5 contacts.
- Primary/secondary priority.
- Normal sharing can go to selected contacts.
- Emergency alerts can include all configured contacts.
- Contacts do not need the app; temporary secure browser journey link is the intended model.
- Journey completion stops live tracking and invalidates the temporary link.

### Progressive Stop Escalation
1. Unexpected stop -> “Are you okay?”
2. Short early no-response window -> light contact buzz.
3. Continued unresolved stop -> stronger escalation around 5–10 minutes, shorter in unusual/night context.
4. Traffic can be used as contextual explanation instead of immediately treating the stop as an emergency.

### UEM
Two paths:
- Manual activation: prototype on-screen trigger representing repeated power-button action; real native app can connect to supported OS/hardware triggers.
- System activation: unresolved journey stop + no response + contextual checks -> urgent support.
Activation alerts contacts, shows map/context/help points, emergency information and 112 action.
Cancellation requires a shared secret known to traveller + trusted contacts; accidental cancellation sends a clear update.
No automatic police call based only on AI classification.

### Get to Safety
Rank practical nearby legitimate options by distance, availability and available context; examples include police station, hospital, verified help point, open public place/staffed establishment, and explicitly configured trusted-person location when available. Use “recommended from currently available information,” never guarantee safety.

### Reports
Report -> Evidence -> Review -> Verified / Questionable / Outdated -> Resolved / Reopen. Evidence can include text/photo/timestamp and appropriate location context. Users can flag questionable/outdated proof and reopen when issue remains.

### Finish
- Journey Complete summary: time, route, modes, walking, transfers, changes, check-ins, battery/connectivity events, reports.
- Feedback.
- Save to My Journeys.
- Stop live location.
- Invalidate temporary link.

## Settings - user-facing only
- Personal information
- Language
- Journey Preferences / Priorities
- Travel modes / walking comfort
- Emergency contacts
- Notifications
- Location & Privacy
- Disha tour replay
- No internal challenge labels such as Round 1 / Round 2 as normal settings categories.

## Product guardrails
- Never claim “safe route”, “unsafe route”, “dangerous area”, “crime score”, “100% safe”, guaranteed safety, predictive crime detection, facial recognition or mass live crowd surveillance.
- Explain journey conditions, uncertainty, freshness and confidence.
- Do not infer safety from income, age, identity or community.
- Prototype-only external services must be clearly simulated.
