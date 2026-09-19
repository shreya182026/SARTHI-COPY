# Final Sarthi Prototype — Consolidated Feature Map

This build consolidates the agreed four-section product flow:

1. Enter & Personalise
2. Plan & Choose Journey
3. Travel & Adapt
4. Help / Report / Finish

## Important product rules
- Portrait/mobile-first experience.
- No safety percentages or numeric Journey Fit scores are shown in the user UI.
- Journey Fit is explained as contextual fit and trade-offs, not a safety probability.
- No “safe route”, “dangerous area”, “100% safe”, crime prediction, facial recognition or mass surveillance claims.
- Internal challenge labels are not exposed as normal app settings.
- Accessibility has been removed as a confusing onboarding questionnaire; walking comfort and practical travel needs remain.
- Sarthi is a soft illustrated Indian-style companion character used throughout onboarding and assistance.
- Language comes after location permission and recommends 2–3 likely languages first.

## Section 1 — Enter & Personalise
Welcome → Get Started → Sign Up / Log In / Guest explanation → phone → OTP → location → language → Sarthi introduction → profile → preferences → guided tour → Home.

Profile collects name, age, career, optional income, preferred modes and walking comfort. Every asked field has a friendly “why we ask” information control.

## Section 2 — Plan & Choose Journey
New Journey → Travel Right Now or Pre-Journey → start point → destination search → travel mode → walking comfort → saved Journey Priorities → route/context comparison → 2–4 practical routes → detail → compare → choose → preparation.

Destination search attempts all-India connected lookup through OpenStreetMap/Nominatim and retains prototype demo suggestions when connected search is unavailable.

## Section 3 — Travel & Adapt
Start Journey → Journey Capsule prepared → Live Journey → live browser geolocation watch → journey progress → lightweight major-step confirmation → Something Changed → re-evaluate/keep current → battery states 40/20/10/5 → connectivity states → offline journey → compact check-in → report issue → finish.

Journey Capsule concept stores essential route, steps, checkpoints, help points, destination, emergency contacts/helplines, legitimate vehicle/provider details and timestamps for offline use.

## Section 4 — Help / Report / Finish
Emergency & Safety → Share Location / Get to Safety / Trusted Person / Emergency-112 → emergency map/context → trusted contacts → temporary secure link concept → UEM → shared-secret cancellation → progressive stop support concept → reports/evidence/review/reopen → Journey Complete → history.

Emergency contact model supports at least five contacts, primary/secondary priority and browser-accessible secure journey-link concept. UEM does not automatically contact police simply because an AI/context condition changed.

## Settings
Personal information, language, Journey Preferences, travel modes, emergency contacts, location & privacy, notifications, Sarthi tour replay. No challenge-round categories.

## Prototype limitations
Real production would connect routing/maps, weather, public transit, backend persistence, SMS/push, secure links and native battery/hardware APIs. Browser geolocation is real when permission is available; hardware power-button detection is represented as an on-screen UEM trigger.
