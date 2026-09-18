# Sarthi Final Submission — Clean Localhost Build

## Start the prototype

1. Extract this folder.
2. Open **this project folder** in VS Code (the folder containing `package.json`).
3. In Terminal run:

```bash
npm install
npm run dev
```

4. Open the Vite localhost URL shown in the terminal.

**Do not double-click `index.html`.** This is a Vite + React app.

## Demo
- New installs start clean. Any old Sarthi localStorage data is cleared once by the versioned data reset.
- There is one complete guided sample journey; there is no seeded user history or pre-filled trusted-contact data.
- Demo OTP: `123456`
- Demo phone: `9876543210`
- UEM prototype cancellation code: `2468`

## Product notes
- Initial journey priorities are user-selected; Recommended badges are suggestions only.
- Primary contacts receive normal journey/live/minor-awareness updates. All configured emergency contacts receive Emergency/UEM alerts.
- Checkpoints and help points use live OpenStreetMap/Overpass lookup when available and are refreshed during an active journey. Fallback markers are labelled as fallback/demo rather than presented as verified live places.
- Live location is used during an active journey only.

## Final prototype hardening
- Route suitability model is used internally to order route options; no numeric suitability score is displayed.
- Route context distinguishes real map infrastructure from unavailable live transit data.
- Journey Capsules retain planned timing and selected-route context.
- Journey issue reports persist locally and can also be stored through the existing Supabase journey event log when configured.
