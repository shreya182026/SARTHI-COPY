# Final build notes

## Demo credentials
- Sample phone: 9876543210
- Demo OTP: 123456

## Real integrations in prototype
- OpenStreetMap tiles + Nominatim place search
- OSRM route geometry
- Browser Geolocation for active journey
- Open-Meteo weather lookup when location is available
- Browser online/offline event monitoring
- `tel:112` and `tel:<state helpline>` handoff
- `sms:` device handoff for sample contact messages

## Emergency escalation
- Light buzz: early awareness to all five emergency contacts; asks them to contact/check the traveller.
- Tight buzz/UEM: urgent red alert to all five contacts with full journey context, nearby checkpoints/help points and relevant helplines.
- Automatic UEM demo path: 0–2 min stop check -> 2–5 min context check -> repeated contact awareness -> 10–15 min escalated UEM. The real app should tune these thresholds by time/context.
- Manual UEM: explicit in-app Activate UEM button.
- Physical repeated power-button trigger: future native mobile scope only.

## Important provider boundary
Live traffic, live public transport status, real cab-provider data and real SMS delivery require authorised API/backend integrations. The prototype keeps honest labels and demonstrates the intended experience with mock/fallback data where credentials are unavailable.

## Refinement pass — 15 Sep 2026
- Dashboard reorganised with a larger Sarthi logo and cleaner brand/greeting hierarchy.
- Mobile typography and wrapping tightened to prevent headings, cards and long labels from overflowing the phone viewport.
- Initial onboarding now collects user-selected Journey Priorities after profile setup. Recommended badges are suggestions only; nothing is auto-selected. Six to seven priorities are requested for a strong starting profile.
- Trusted Contacts are collected during onboarding. On supported Android browsers, the Contact Picker API can open the phone contact list; manual entry remains available when the browser does not expose it. At least five configured contacts are required for the mentor prototype. Any number of configured contacts may be marked Primary.
- Primary contacts are the normal journey-sharing group for journey start/live context and minor awareness. Emergency/UEM alerts target every configured contact.
- Route checkpoints and help points now use a live OpenStreetMap/Overpass lookup along the selected route. Results include names, categories, distance from route and source, are refreshed periodically during an active journey, and are stored in the Journey Capsule. Fallback markers are explicitly labelled as route fallback data and are never presented as verified places.
- Get to Safety now uses the live help-point list and opens turn-by-turn navigation to a selected point instead of showing static demo rows.
- Emergency/UEM screens now expose the current journey context, route points, support details and real SMS/112 handoff actions.
- SMS actions compose detailed real device SMS messages; browser-only builds do not silently send SMS without a native/backend provider.

## ML route suitability integration — 18 Sep 2026
- The route-analysis flow now calls `/api/ml-route-suitability` for each backend route.
- The existing logistic-regression model in `api/ml-model.json` is now connected to the route cards.
- Model inputs include duration, cost, walking, transfers, connectivity, battery, nearby help-point availability, rain, wind speed and a priority-match feature.
- The previous `/api/route-suitability` endpoint is retained for compatibility but is no longer the route-analysis scoring path.

## Prototype hardening pass — 18 Sep 2026
- ML route suitability is now used as an internal ranking signal for backend-generated route options; the numeric model score is not exposed in the UI.
- Route cards no longer label nearby transit infrastructure as if it were the route's live transit service; live arrivals/vehicle status remain explicitly unavailable.
- Journey Capsule now stores planned timing, coordinates and selected route details for stronger offline context.
- Journey-start events now include route/from/destination metadata.
- Journey completion events are correctly stored as completed in the Supabase journey record.
- Journey issue reports are saved locally and sent to a backend report-event endpoint that records the report in the existing journey event log when Supabase is configured.
- Journey feedback is retained with the completed local journey record.
