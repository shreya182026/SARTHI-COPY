# Sarthi consolidated build status

This repository now uses `src/App.tsx` + `src/index.css` as the single prototype runtime.

## Section 1 — Enter & Personalise
- Welcome / Get Started
- Sign Up / Log In / Guest explanation
- Phone number + OTP simulation (123456)
- Location permission
- Location-based language recommendations
- Full language chooser
- Sarthi introduction
- Personal information
- Default travel preferences
- Walking comfort
- Guided Sarthi tour

## Section 2 — Plan & Choose Journey
- Travel Right Now / Pre-Journey
- Starting point
- All-India connected destination lookup (OpenStreetMap/Nominatim)
- Map selection/preview
- Travel mode
- Per-journey walking comfort
- Saved Journey Priorities with per-item info controls
- Context-aware route ranking
- 2–4 practical route options
- Why This Route?
- Freshness + confidence
- Route detail
- Comparison
- Preparation

## Section 3 — Travel & Adapt
- Journey Capsule created at journey start
- Live browser geolocation watch during active journey
- Live map / last known location
- Step progression + lightweight confirmation
- Something Changed → re-evaluate / keep current
- Battery demo: 40 / 20 / 10 / 5
- Connectivity demo: Normal / Unstable / Low / Offline
- Offline Journey
- Compact check-in
- Journey issue reporting

## Section 4 — Help / Report / Finish
- Emergency & Safety
- Share Location
- Get to Safety
- Trusted Contacts (5 seeded contacts)
- Emergency / 112
- Emergency map/context
- Temporary journey link concept
- UEM with shared-secret cancellation
- Progressive journey-stop escalation simulation
- Report → Evidence → Review → Reopen
- Journey Complete
- My Journeys
- Frequent Journeys
- Settings

## Intentional product boundaries
- No numeric safety/Journey Fit score is shown.
- No “safe route”, “dangerous area” or guaranteed-safety claims.
- Accessibility questionnaire is removed from onboarding to avoid confusing users; walking comfort and travel-mode preferences remain.
- UEM hardware trigger is represented by a prototype UI action; production Android can connect OS-supported hardware triggers.
- Real routing, weather, transit, SMS/push, backend persistence and secure links remain integration points for a production build.
