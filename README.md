# Omed

A React Native (Expo) app for tracking medications and appointments, with reminders that
stay in sync with a backend so a caregiver — not just the person's own device — can
eventually see what's been taken, skipped, or missed.

## Features

- **Auth** — register/login against a live backend, persistent session, biometric login
- **Medications** — add medications, schedule reminders per medication
- **Appointments** — create appointments with a reminder ahead of time
- **Reminders** — local device notifications kept in sync with a backend reminder record;
  full lifecycle (`PENDING → TRIGGERED → TAKEN / SKIPPED / MISSED`), reported back to the
  backend via three layers: while the app is open, on notification tap, and periodic
  background reconciliation (development builds only)
- **Dashboard** — active medications, today's reminders/appointments, missed count, a
  featured "next up" reminder with inline Taken/Skip, upcoming appointment, recent activity
- **Settings** — notification, sound, vibration, and avatar preferences (UI only for now —
  see [Known limitations](#known-limitations))
- **Caregiver connections** — invite/connect-by-code flow (UI only for now)

## Tech stack

- [Expo](https://expo.dev) SDK 54 / React Native 0.81 / React 19
- [React Navigation](https://reactnavigation.org) (native-stack)
- `expo-notifications` — local scheduled notifications
- `expo-task-manager` + `expo-background-task` — background reminder reconciliation
- `expo-local-authentication` — biometric login
- `expo-video` — splash screen animation
- `axios` — API client
- Backend: REST API at `https://healthnest-juho.onrender.com/api/v1` (not part of this repo)

## Getting started

### Prerequisites

- Node.js and npm
- The [Expo Go](https://expo.dev/go) app **or** a development build of this project on
  your device — see [Development build](#development-build) for why plain Expo Go has
  limits here

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). If you and your device
are on different networks, or you're on a phone hotspot, LAN mode can fail to connect —
use tunnel mode instead:

```bash
npx expo start --tunnel
```

### Development build

Expo Go can run most of this app, but as of Expo SDK 53+, Expo Go dropped support for
several native modules used here — most notably the background reminder reconciliation
task (`expo-task-manager` / `expo-background-task`). To exercise that feature you need a
[development build](https://docs.expo.dev/develop/development-builds/introduction/):

```bash
npx expo install expo-task-manager expo-background-task expo-dev-client
eas build --profile development --platform android   # or ios
```

Then run against it with:

```bash
npx expo start --dev-client
```

### Standalone builds (for testers)

A development build needs your Metro server running — it's for active development, not
for sharing. To give someone an installable app that works on its own network, use the
`preview` profile instead:

```bash
eas build --profile preview --platform android   # or ios
```

This produces a real standalone install with the JS bundle baked in — no dev server
required. Share the resulting link directly.

## Project structure

```
api/            API client and per-resource request functions (auth, medications,
                appointments, reminders, dashboard)
components/     Reusable UI (ReminderCard, MenuRow, FormInput, ErrorBoundary, ...)
context/        AuthContext — session state and token persistence
lib/            Local notification scheduling, background task registration,
                time/error formatting helpers
screens/        One file per screen, grouped by flow (auth, medications, appointments,
                caregiver, settings)
App.js          Navigation tree, global notification/background-task wiring
index.js        Entry point — registers the background task before anything else mounts
```

## Known limitations

- **Profile editing, caregiver connections, and notification/sound/vibration/avatar
  settings are UI-only.** The backend doesn't have endpoints for these yet, so Save
  currently shows a success state without persisting anything. See the TODO comments in
  `EditDetailsScreen.js`, `ManageCaregiverScreen.js`, and the settings screens.
- **Reminders are per-device.** A reminder created on one device only schedules a local
  notification on that device — a caregiver logged in on a second device sees the same
  data in their dashboard but won't get their own notification for it.
- **Background reconciliation has real platform limits.** A local notification can't wake
  a fully-killed app to report itself the way a remote push notification can. The
  background task is a periodic catch-up (checking for reminders that should have fired by
  now), not an instant report, for the case where the app was killed and never reopened.
- **No token refresh flow yet.** The client clears stored tokens on a 401; there's no
  `/auth/refresh` call, so sessions may end sooner than the backend's token lifetime
  otherwise implies.

## License

Private project — not currently licensed for reuse.
