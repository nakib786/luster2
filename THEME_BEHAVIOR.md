# Theme Toggle Behavior

## Overview
The theme toggle now implements a simplified two-mode system with system mode as the default behavior.

## Behavior

### Default State
- When no user preference is stored, the app defaults to **system mode**
- System mode automatically follows the user's OS theme preference
- The toggle button shows the current effective theme (light/dark icon)

### User Interaction
- **First click**: If in system mode, toggles to the opposite of current effective theme
- **Subsequent clicks**: Toggles between light and dark modes only
- **No system mode in UI**: Users only see light/dark options, never a "system" option

### Example Scenarios

#### Scenario 1: User has dark mode in OS
1. App loads → Shows dark mode (following OS)
2. User clicks toggle → Switches to light mode
3. User clicks toggle → Switches to dark mode
4. User clicks toggle → Switches to light mode
5. (Continues alternating between light/dark)

#### Scenario 2: User has light mode in OS
1. App loads → Shows light mode (following OS)
2. User clicks toggle → Switches to dark mode
3. User clicks toggle → Switches to light mode
4. (Continues alternating between light/dark)

## Technical Implementation

### ThemeContext Changes
- Added `isSystemMode` helper to track when in system mode
- Modified `toggleTheme()` to handle system mode as starting point
- `setTheme()` now only accepts 'light' or 'dark' (no 'system')
- System mode is internal state, not user-selectable

### ThemeToggle Changes
- Icon and label always reflect `effectiveTheme` (what user sees)
- Animation key uses `effectiveTheme` instead of internal `theme`
- No visual indication of system mode to user

## Benefits
- Simpler user experience (only 2 visible modes)
- System mode works as expected default
- No confusing "system" option in UI
- Maintains system preference following when no explicit choice made
