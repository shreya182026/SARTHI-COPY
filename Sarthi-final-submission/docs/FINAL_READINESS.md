# Sarthi — Final readiness (Prompt 4)

## Code completion

The browser prototype is feature-complete against the supplied Sarthi product references for the requested demo scope: onboarding, Disha tour, saved preferences, journey planning, route comparison/explanation, Journey Capsule, low-power/offline flow, Something Changed, progressive UEM, emergency/support actions, journey history/replay, reports/review/reopen, settings, and backend event hooks.

## Connected now

- Browser geolocation during an active journey.
- OpenStreetMap/Nominatim place lookup and map data.
- OSRM road routing and route alternatives (up to three returned by the backend).
- Open-Meteo current weather context.
- OpenStreetMap/Overpass nearby transit infrastructure and journey/help points.
- Saved logistic-regression inference through the ML route-suitability API.
- ML output used as one input to route ordering/context explanation; the UI does not expose a numeric safety score.
- Supabase event persistence through the existing backend event routes when deployment environment variables are present.
- Browser-local Journey Capsule/history storage.

## Intentionally not claimed as live

- Live traffic conditions.
- Live metro/bus arrival times or vehicle positions.
- Live cab-provider availability/vehicle data.
- Automatic SMS delivery without a configured SMS provider.
- Native background location and physical power-button UEM triggers.
- Production-grade OTP/identity provider.
- Production signed/expiring public journey links.

These are provider/native infrastructure boundaries, not unfinished code bugs. The UI and documentation label these boundaries rather than fabricating live data.

## Final demo rule

Use the sample journey or a real location search. Show current map/weather data, route comparison, ML/context explanation, Capsule/offline preparation, Something Changed, UEM, Emergency & Safety, My Journeys, and Reports/Review. If asked about traffic, cab, transit arrivals, SMS, or native hardware, explicitly call them production-next integrations.

## Final product sentence

“Sarthi does not promise a perfect route. It helps a traveller understand the journey, stay prepared when conditions change, and act when support is needed.”
