# Dalvì Interlude

**Small, research-backed breaks inside Claude Code.**
Type `/breathe` for a 1–5 minute pause. After a long stretch of work, or when work gets stuck, a quiet card suggests one for you. Every break shows the study behind it.

*Μικρά διαλείμματα με επιστημονική βάση, μέσα στο Claude Code. Ελληνικά και English.*

```
╭───────────────────────────────────────────────────────────────────────╮
│ Been working a while; ready for a little pause?                       │
│ A walk with no destination · 2 min                                    │
│ If walking feels comfortable, get up for a little wander.             │
│ [ Let’s begin ]  [ Another idea ]  [ Later ]  [ No more today ]       │
╰───────────────────────────────────────────────────────────────────────╯
```

---

## Contents

- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Commands](#commands)
- [Default settings](#default-settings)
- [Friction signals](#friction-signals)
- [The AI check](#the-ai-check)
- [Profiles: default and enterprise](#profiles-default-and-enterprise)
- [The breaks and the evidence](#the-breaks-and-the-evidence)
- [Privacy](#privacy)
- [Troubleshooting](#troubleshooting)
- [For developers](#for-developers)

---

## Quick start

**You need:** Claude Code **2.1.288 or later**. Check with `claude --version`, and update with `claude update`.

**1. Install**

Once Dalvì Interlude is listed in the Claude directory, open `/plugin` in Claude Code and search for **Dalvì Interlude**.

Until then, from a local copy:

```bash
git clone https://github.com/LiTseri/dalvi-interlude.git
claude --plugin-dir ./dalvi-interlude
```

**2. Try a break**

```
/breathe
```

A panel opens with one break, its steps and a timer. Press **Let’s begin**.

**3. Keep working**

That's it. After 90 minutes of active work, a card will suggest a break. Type `/breathe help` anytime for the guide.

---

## How it works

In plain words:

1. **You work as usual.** The mod notes *when* you send messages, not what they say, to count active work time.
2. **After 90 minutes of active work**, when Claude has finished what it was doing, a card appears above the prompt with one suggested break.
3. **You choose.** Start it, ask for another idea, snooze it, or turn suggestions off for today. Ignoring it is fine too.
4. **Optionally**, you can let it notice when work gets stuck ([friction signals](#friction-signals)) and suggest a break sooner.

It never interrupts Claude mid-task, never shows a card during quiet hours, and never shows more than your daily limit.

---

## Commands

| Command | What it does |
|---|---|
| `/breathe` | Opens a break that fits the time of day |
| `/breathe <category>` | A break from one category: `breathing` · `movement` · `water` · `eyes` · `mind` · `closing`. Greek works too: `αναπνοή` · `κίνηση` · `νερό` · `μάτια` · `νους` · `κλείσιμο` |
| `/breathe status` | Your current settings and active time |
| `/breathe preview` | Shows the automatic card right now, so you can see it. Doesn't count toward your limit |
| `/breathe help` | The full guide, in your language, with your current settings |
| `/breathe limit <0–10>` | How many automatic suggestions per day. `0` turns them off; `/breathe` still works |
| `/breathe lang el\|en\|auto` | Language of the mod |
| `/breathe signals on\|off` | Turns [friction signals](#friction-signals) on or off |
| `/breathe ai on\|off` | Turns [the AI check](#the-ai-check) on or off. Turning it on asks for your consent first |

**In the break panel:** press `1`–`6` to switch category, `Tab` to move between buttons, `Enter` to press one. **The research** shows the study behind the break.

---

## Default settings

What you get out of the box, and how to change it.

| Setting | Default | What it means | Change with |
|---|---|---|---|
| Automatic suggestions | **On, up to 4 a day** | A card may appear after long work | `/breathe limit 0–10` |
| Active-work threshold | **90 minutes** | Time of active work before a card | fixed |
| Idle reset | **15 minutes** | A longer pause between your messages starts the count again | fixed |
| Minimum gap | **45 minutes** | Between two automatic cards | fixed |
| Quiet hours | **20:00–08:00** | No automatic cards; `/breathe` still works | fixed |
| Snooze | **15 / 30 / 60 minutes** | Chosen from the card's **Later** button | on the card |
| Language | **auto** | Follows the language you write in; before that, your computer's language; otherwise English | `/breathe lang el\|en\|auto` |
| Friction signals | **Off** | Earlier suggestions when work gets stuck | `/breathe signals on` |
| AI check | **Off**, needs consent | Confirms friction with Claude Haiku before a card | `/breathe ai on` then `/breathe ai agree` |
| Profile | **default** | The AI check can be turned on | plugin option `profile` |

Your settings are kept between sessions.

---

## Friction signals

**What it is.** When work gets stuck, a break helps more than another retry. With signals on, the mod watches for a few short phrases in the messages you type and suggests a break sooner than 90 minutes.

**What counts as friction**

| Kind | Examples | How many it takes |
|---|---|---|
| Unchanged failure | "still fails", "same error", «ακόμα δεν δουλεύει», «ίδιο σφάλμα» | Twice within 10 minutes |
| Stuck | "I'm stuck", "nothing worked", «έχω κολλήσει» | Once |
| Frustration | "so frustrating", «με εκνευρίζει» | Once |
| Tiredness | "my eyes are tired", "need a break", «κουράστηκαν τα μάτια μου» | Once |

**What it ignores:** ordinary questions ("why is this slow?"), code blocks, logs, quotes, examples, and other people's messages. Saying it worked ("that worked", «τώρα δουλεύει») clears everything it had noticed.

**What it keeps:** only the *kind* of cue and *when* it happened, for 10 minutes. Never the words.

**Turn on:** `/breathe signals on`

---

## The AI check

**What it is.** Phrases can mislead. The optional AI check asks **Claude Haiku** to confirm that the work really looks stuck before a friction card is shown. If Haiku says the work looks focused, no card appears.

**How it works**

- It runs **only** when signals already noticed friction, never on every message.
- It sends **up to your 5 most recent typed messages**, with fenced code, quotes and log lines removed and each cut to 600 characters.
- It goes through **Claude Code's own connection and credentials**. The mod has no API key and no server. It counts toward your own usage.
- The answer is used for one decision and then **discarded**.
- If Haiku can't be reached, the local signal alone decides.

**Consent.** `/breathe ai on` shows exactly what will happen, in Greek and English, and waits. Only `/breathe ai agree` turns it on. Turning it on also turns on friction signals. `/breathe ai off` turns it off and clears the recent messages from memory.

---

## Profiles: default and enterprise

The plugin has one option, `profile`:

| | `default` | `enterprise` |
|---|---|---|
| AI check at start | Off | Off |
| Can a user turn it on? | Yes, with consent | **No, it's locked** |
| Meant for | Individuals | Organisations that don't allow prompt text to leave for extra analysis |

`default` is what everyone gets unless an administrator sets `enterprise` in the plugin's settings. Both profiles have the same breaks, cards and friction signals.

---

## The breaks and the evidence

**20 breaks in 6 categories**

| Category | Breaks | Examples |
|---|---|---|
| Breathing | 3 | Cyclic sighing, an easy breathing rhythm |
| Movement | 4 | A short walk, standing up, moving in your chair |
| Water | 2 | A sip of water if thirsty, a walk to refill |
| Eyes | 2 | Looking into the distance, gentle blinks |
| Mind | 6 | A pause with no agenda, letting a problem rest |
| Closing | 3 | Noting where to start tomorrow, finishing for the day |

Automatic cards suggest only breaks that suit everyone and the time of day. Seven more specific ones, such as breath holds or a bedtime list, open only when you choose them from the panel.

**Every break shows its research.** Press **The research** to see a one-line claim, the study and its DOI. Each break carries an evidence level:

| Level | Label | Means |
|---|---|---|
| **A** | Strong evidence | A meta-analysis or several consistent trials (2 breaks) |
| **B** | Good evidence | At least one good controlled trial (5 breaks) |
| **C** | Early findings | Smaller or indirect studies, or a short adaptation of a studied practice (13 breaks) |

Claims describe what the research found, never what will happen to you. All 20 DOIs were checked against their publications. Sample sizes, durations and limitations for each study are in [`spec/actions.yaml`](spec/actions.yaml).

---

## Privacy

- **Your messages are never stored**, in any mode.
- **Nothing is sent anywhere** unless you turn on the AI check and agree.
- **No analytics, no accounts, no network calls of its own.**
- Kept on your computer: your settings, today's counters, and which breaks were suggested recently.

Full details, in English and Greek: [PRIVACY.md](PRIVACY.md).

---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| `Unknown command: /breathe` | The mod isn't loaded. Check `claude --version` is 2.1.288+, and start Claude Code with `--plugin-dir` (or install it from `/plugin`) |
| No card after a long session | Check `/breathe status`: the daily limit may be reached, suggestions snoozed or off for today, or it's quiet hours. A pause over 15 minutes resets the count |
| Numbers type into the prompt instead of switching category | Click inside the panel first, so it has focus |
| The panel opens below the conversation | The terminal is narrow. Widen it to see the panel beside the conversation |
| Wrong language | `/breathe lang el` or `/breathe lang en` |
| `/breathe ai on` says it's locked | The plugin's `profile` is `enterprise`, set by your administrator |

---

## Not medical advice

These are short, optional pauses based on published research. They are not treatment for any condition. Stop if anything feels uncomfortable, and follow any advice you have from a professional.

---

## For developers

### Requirements

- Claude Code **2.1.288+** (the mods API: function hooks, `$.ui`, `$.model.complete`)
- Python 3 with PyYAML, only to regenerate data from `spec/`

### Project layout

```
.claude-plugin/plugin.json   manifest: name, version, userConfig.profile
hooks/
  hooks.json                 points to the hooks module
  register.tsx               the mod: events, commands, card and panel UI
  select.ts                  pure logic: time zones, gates, break selection
  signals.ts                 pure logic: friction cues, origin filter, AI prompt and parsing
  catalog.ts, copy.ts        GENERATED from spec/ (do not edit by hand)
types/index.d.ts             shared types and the plugin's state contract
spec/                        source of truth
  actions.yaml               the 20 breaks, claims, sources, limitations
  rules.yaml                 timing, gates and selection rules
  signals.yaml               friction cues and the AI check specification
  ui-copy.yaml               every user-facing string on the card and panel
  BREATHE_DESIGN_NOTES.md    design rationale and research notes
tests/                       45 tests, run against the Claude Code engine
```

### Design principles

- **Spec first.** Content and rules live in `spec/`, and code is generated from or mirrors it. Writers edit `spec/ui-copy.yaml` and `spec/actions.yaml` without touching code.
- **Pure core.** Selection, gates and friction detection are pure functions with no side effects, so every rule is unit-tested.
- **Privacy by construction.** Prompt text exists only in memory and, only while the AI check is on, as the last 5 messages. Persistent storage holds settings, counters and timestamps. A test asserts no prompt text reaches storage.
- **Never interrupt.** Cards appear only at the end of a turn the person started, and every automatic path passes the same gates (limit, snooze, quiet hours, spacing).
- **Fail safe.** If the model call is refused or unreachable, the local signal decides. If no break passes the filters, no card is shown.

### Commands

```bash
claude plugin validate .   # check the manifest and hooks the way the engine reads them
claude plugin test .       # run the tests in tests/
python3 build-catalog.py   # regenerate hooks/catalog.ts and hooks/copy.ts from spec/
```

### What the tests cover

Time zones and quiet hours, every nudge gate, idle reset and long turns, break selection and rotation, friction cues in Greek and English (including code, quotes, negation and success), which prompts count, the AI check's consent flow, refusal and enterprise lock, the panel's category buttons, and that no prompt text is ever stored.

---

## License

[MIT](LICENSE) © 2026 Princess M · Dalvì
