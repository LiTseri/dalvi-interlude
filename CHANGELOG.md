# Changelog

All notable changes to Dalvì Interlude. Versions follow [Semantic Versioning](https://semver.org).

## Unreleased

## 1.0.1 · 2026-10-16

A polish release: no new breaks, a few fixes and clearer documentation.

**Fixed**
- "I don't need a break" or «δεν χρειάζομαι διάλειμμα» no longer counts as a friction cue, while a negation in an earlier sentence ("It doesn't. Still failing.") never cancels the next one.
- The `enterprise` profile now locks the AI check whatever the case or spacing (`Enterprise`, ` enterprise `).
- Closing the break panel any way (button, close key) now stops its timer.
- An empty `LC_ALL` no longer hides a Greek `LANG`; `LC_MESSAGES` is read too.
- If the mod fails while reading a prompt, the prompt now always goes on untouched.

**Changed**
- The AI check is skipped when no break could be shown anyway, so no model call is wasted.
- The AI-check consent text now lists exactly what is removed before sending and what may still be included, matching PRIVACY.md. It is generated from `spec/signals.yaml`, as are the friction phrases and the signal → category mapping.
- Greek status and help show setting states in Greek.
- The `/breathe` hint lists every subcommand.

**Added**
- `/breathe reset` (also `/breathe επαναφορά`): deletes everything the mod keeps and returns to the defaults.
- Install steps for the Claude directory, SECURITY.md, CONTRIBUTING.md and this changelog.
- `python3 build-catalog.py --check`, and tests for snooze, "No more today", previews, quiet hours, the break timer, negated cues, the enterprise lock and the locale fallback.

## 1.0.0 · 2026-10-04

First release, listed in the Claude directory.

- `/breathe` with 20 research-backed breaks in 6 categories, each with its source, DOI and evidence level.
- Gentle automatic suggestions after 90 minutes of active work, with a daily limit, quiet hours, snooze and "No more today".
- Optional local friction signals and an optional AI check with explicit consent; `enterprise` profile locks the AI check off.
- Greek and English.
