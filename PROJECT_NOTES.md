# Project notes

## What the app is for
Lane Dash is a small car game. The player steers a car across three lanes and dodges red barriers while the road speeds up. The score is how far the car has driven.

## Main screens
- **Home** (`/`): the app name, a Play button and the rules.
- **Play** (`/#/play`): the road (canvas), score, Start/Restart button, and Left/Right buttons for touch screens. Keyboard: arrow keys or A/D to steer, Space or Enter to start.

## API endpoints
None yet. The game runs entirely in the browser.

## Saving (free trial)
- Nothing is saved. The score and the car's position live only in the Play screen's state and reset on reload.
- When saving turns on after upgrading, a good first step is saving a best score on the Play screen.

## Decisions
- Three lanes, obstacles come from the top, speed rises slowly with distance.
- Crashing ends the run; the player restarts with the button or Space.
