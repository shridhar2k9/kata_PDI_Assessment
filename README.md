# SpaceX Launch Explorer

An Angular application for browsing SpaceX launches. The launch list and details are loaded from the local `public/launches.json` mock, and NgRx Signal Store keeps launch data and favorites available across routes.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Run locally

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200). Use the search field to filter missions, open a launch for its details, and toggle its favorite state from either view.

## Checks and production build

```bash
npm test
npm run build:production
```

The production build is written to `dist/spaceX_kata/browser`.

## State management

- A root-provided NgRx Signal Store owns launch data, loading/error status, and favorite flight numbers.
- Store methods call the data service through `rxMethod`, handling list and detail requests with RxJS flattening operators.
- `withComputed` exposes derived favorite launches and count; `patchState` applies immutable state updates.
- Components consume state as Angular signals and do not call the HTTP service directly.
- Favorites persist while navigating between routes for the lifetime of the application.
