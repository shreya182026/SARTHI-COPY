# Sarthi - Complete Product Specification

## Product identity
- App: Sarthi
- Companion/assistant: Disha
- Core line: Find the journey that fits your situation.
- Sarthi logo and Disha are intentionally different: logo = product identity, Disha = friendly guide.
- Mobile-first, portrait-oriented experience for India.

## 1. First-time entry
Welcome -> Get Started -> Sign Up / Log In / Guest -> Phone -> OTP -> Location -> Language -> Disha introduction -> Profile -> Default travel style -> Guided dashboard tour -> Home.

Sign Up is recommended because it enables saved profile, preferences, trusted contacts, journey history and recurring journey suggestions.
Guest can plan/compare core flows, but history is not permanently saved.
Returning users: Phone -> OTP -> saved profile -> Home.

## 2. Onboarding principles
Disha introduces herself before asking profile questions.
Disha speaks like a friend: warm, short, clear, never authoritative.
Each question has a friendly information button explaining why Sarthi asks it.
Do not dump a long form on the user.
Collect basic information and normal travel preferences once. At each journey, ask only: “Do you want to adjust your preferences for this journey?”
Do not use a separate accessibility questionnaire; keep practical walking comfort and relevant travel needs understandable.

## 3. Profile + defaults
Collect:
- name
- age
- career / occupation
- optional income range (affordability only; never safety inference)
- preferred travel modes
- walking comfort
- Journey Priorities saved as defaults
All can be changed later in Settings.

## 4. Location and language
Location is requested before language selection.
Location is explained in friendly language.
After location, show 2-3 likely languages first, then the rest of the supported list.
Language applies to the whole UI through centralized i18n architecture.
Language can be changed later in Settings.

## 5. Guided tour
Disha gives a complete four-part tour, not just an introduction:
1. Plan a Journey
2. Travel & Adapt
3. Emergency & Safety
4. My Journeys / Frequent Journeys
Tour has Next, skip and replay. The user can replay the full tour from Settings.

## 6. Home dashboard
Show:
- greeting
- New Journey
- My Journeys
- Frequent Journeys
- Emergency & Safety
- compact current-location/map preview
- Disha assistant
- Settings at bottom

## 7. New Journey - planning
Two distinct choices:
- Travel Right Now
- Pre-Journey
Pre-Journey captures intended date/time.

Starting point:
- current location
- saved/recent locations
- search
- map pin
Destination:
- address
- place
- landmark
- map
- India-wide connected place search when available
- useful fallback suggestions when search is unavailable

Travel mode:
- Walk
- Metro
- Bus
- Auto/Rickshaw
- Cab
- Bike/Scooter
- Personal vehicle
- Let Sarthi decide / multimodal comparison

Walking comfort can be adjusted for the journey without replacing the saved default.

## 8. Journey Priorities
Use:
- Most Important
- Important
- Not Important

Example priorities:
- fastest
- cheapest
- lower walking
- fewer transfers
- public activity
- lighting continuity
- visibility
- predictability
- weather exposure
- connectivity
- help access
- first/last mile

No numeric sliders.
A “Not Important” factor may still materially affect a journey; explain why instead of silently ignoring it.

## 9. Context-aware journey comparison
The system conceptually considers time, route duration, cost, walking, transfers, first/last mile, weather, transport status, legitimate lighting/visibility/activity context where available, help points, connectivity, battery, recent reports, user priorities, freshness and confidence.

Never claim:
- safe route
- unsafe route
- dangerous area
- guaranteed safety
- crime score
- predictive crime detection
- facial recognition
- mass live crowd surveillance

Sarthi recommends a journey fit, not a safety probability.

## 10. Route Results
Show 2-4 practical options.
Each card shows:
- total time
- cost
- walking
- transfers
- modes
- priority matches
- context summary
- freshness
- confidence
- Why This Route?

Do not display a numeric Journey Fit or safety percentage.
Route detail includes steps, first/last mile, fingerprint chips, context, freshness, confidence and map.

## 11. Compare and choose
Side-by-side comparison:
- time
- cost
- walking
- transfers
- modes
- context
- freshness
- confidence

User can adjust preferences after seeing routes; ranking is refreshed.
Choose route -> Journey Preparation -> Start Journey.

## 12. Journey Capsule
At Start Journey, create an offline-ready packet containing:
- essential route/map information
- route steps
- checkpoints + locations/distances
- destination
- help points
- emergency contacts
- relevant helplines
- legitimate vehicle/provider details when available
- last known route/state
- timestamps and last sync

If network disappears, the capsule is the fallback source for essential guidance.
Never claim a remote update was delivered when there is no network.

## 13. Live Journey
Live journey map is primary.
Show:
- current/last known location
- destination
- planned route context
- current step
- next step
- progress
- battery
- connectivity
- help
- emergency

Browser geolocation watches the device position while the active journey is running. At journey finish, active tracking ends.
Major steps use lightweight confirmation.

## 14. Something Changed
Possible triggers:
- transport delay
- weather change
- connectivity instability
- battery reduction
- route disruption
- relevant recent report
- major walking change

Message:
Something Changed -> explain -> Re-evaluate / Keep Current Journey.
Never silently reroute.

## 15. Battery / low-power mode
Thresholds:
- 40%: Low-Power Journey Mode, reduce background activity, essential information prepared.
- 20%: brief status/battery awareness to trusted contacts.
- 10%: stronger battery warning.
- 5%: Critical Low Battery Mode; preserve only route, location, help, emergency and essential sync.

Low-power sharing concept:
status + location + journey map/link.

## 16. Connectivity / offline mode
States:
Normal -> Unstable -> Low Connectivity -> Offline -> Back Online.

First meaningful instability:
- notify user
- prepare offline data
- attempt non-emergency awareness update when communication is available

Offline screen keeps:
- essential route
- checkpoints
- help points
- destination
- current/last known position
- emergency access
- compact check-in
- last sync time

Compact check-in:
I’m OK / Delayed / Need Help / Emergency.

When connection returns: Journey synced.

## 17. Privacy
Live location is used only during an active journey.
Temporary journey link exists for the active journey and is invalidated when the journey ends.
Personal vehicle number stays private.
Provider/vehicle details are shown only if legitimately available.

## 18. Trusted Contacts
Support at least 5 emergency contacts.
Store name, relation, phone, priority/primary-secondary.
Normal sharing -> selected contacts according to settings.
Emergency -> all configured emergency contacts receive context-rich alerts.
Contacts do not need the app; use a temporary secure browser link concept.

## 19. Progressive journey-stop escalation
Unexpected stop -> “Are you okay?”
No response after a short early window -> light contact buzz.
Still unresolved -> stronger escalation around 5-10 minutes, shorter in unusual/night context.
If traffic is clearly present, explain likely delay before escalating.
Do not immediately call police on a stop alone.

## 20. Emergency portal
Always accessible from Home, Live Journey, Offline/low-battery modes.
Actions:
- Share Location
- Get to Safety
- Contact Trusted Person
- Emergency Information / 112

Emergency map:
- planned route
- actual/last-known path where available
- location
- destination
- nearby help points
- last update
- mode
- legitimate provider/vehicle info
- context information

External Google Maps can be used as the navigation handoff; Sarthi remains the context page.

## 21. UEM - two activation situations
### Manual
User consciously triggers emergency. Browser prototype uses an on-screen emergency trigger representing the planned repeated hardware action. Future native app can connect supported OS/hardware actions such as repeated power-button activation.

Manual activation immediately:
- opens urgent support
- alerts all emergency contacts
- shows emergency context
- shows help points
- shows 112 information/action
- provides Get to Safety navigation

### Non-manual / system-triggered
Sarthi observes an unexplained journey stop.
It asks “Are you okay?”
If no response, it sends an early light contact buzz.
If still unresolved after contextual checks (including traffic context, time/context), it escalates strongly.
This becomes the system-triggered urgent support path.

Emergency cancellation:
- requires a shared secret known to traveller + trusted contacts
- unknown person cannot cancel
- accidental cancellation sends a clear cancellation message to contacts

No automatic police call based only on an AI classification.

## 22. Get to Safety
Offer practical nearby options based on available information:
- police station
- hospital
- verified help point
- open public/staffed place
- explicitly configured trusted-person location where legitimately available

Rank by distance, availability and context.
Use “Recommended from currently available information.”
Provide “Go there now” style navigation without a safety guarantee.

## 23. Reporting
Keep reporting attached to the journey.
Report types:
- incorrect route information
- outdated information
- incorrect help point
- changed transport condition
- incorrect context
- issue still unresolved

Evidence can include text/photo/timestamp/location context when appropriate.
Flow:
Report -> Evidence -> Review -> Verified / Questionable / Outdated -> Resolved / Reopen.
Users can flag questionable or outdated proof and reopen a still-existing issue.

## 24. Journey completion
At destination:
- Journey Complete
- time
- route
- modes
- walking
- transfers
- changes
- check-ins
- battery/connectivity events
- reports
- feedback

Then:
- save to My Journeys
- stop live location
- invalidate temporary journey link

## 25. My Journeys + Frequent Journeys
My Journeys:
- calendar
- journey details
- timeline
- map replay
- changes
- check-ins
- reports
- emergency events
- legitimate vehicle/provider details

Frequent Journeys:
- recurring patterns generated from history
- one-tap plan
- not manually saved every time

## 26. Settings
Only user-facing controls:
- personal information
- language
- journey preferences/priorities
- travel modes + walking comfort
- emergency contacts
- notifications
- location & privacy
- Disha guided-tour replay

No challenge labels such as Round 1 / Round 2.

## 27. Disha design
Disha is an illustrated, friendly Indian-style young woman/AI guide.
She is visually distinct from the Sarthi logo.
Use soft animation, expressive but calm poses, simple speech bubbles and contextual explanations.

## 28. Presentation wording
Use:
- context-aware
- journey fit
- better matches your priorities
- currently available information
- confidence
- freshness
- Something Changed
- Journey Capsule
- Get to Safety

Avoid safety guarantees and numeric safety scores.

## 29. Prototype vs real deployment
Prototype can simulate OTP, route data, battery/connectivity, emergency notifications, secure links, provider details and UEM trigger.
Real deployment would add authentication backend, maps/routing APIs, weather/transport APIs, SMS/push services, database, secure temporary-link service, native battery APIs and native hardware triggers.
