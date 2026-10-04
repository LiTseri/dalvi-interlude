# Dalvì Interlude

Small, research-backed breaks inside Claude Code. Type `/breathe` for a 1–5 minute break. After long stretches of work, or when work gets stuck, a quiet card suggests one for you.

*Μικρά διαλείμματα με επιστημονική βάση, μέσα στο Claude Code. Ελληνικά και English.*

## Install

Requires Claude Code **2.1.288 or later** (mods).

Once listed in the Claude directory: open `/plugin` and search for **Dalvì Interlude**.

From a local copy:

```bash
git clone https://github.com/LiTseri/dalvi-interlude.git
claude --plugin-dir ./dalvi-interlude
```

## Commands

| Command | What it does |
|---|---|
| `/breathe` | A break that fits the time of day |
| `/breathe <category>` | `breathing` · `movement` · `water` · `eyes` · `mind` · `closing` (also in Greek: `αναπνοή`, `κίνηση`, `νερό`, `μάτια`, `νους`, `κλείσιμο`) |
| `/breathe limit <0–10>` | Automatic suggestions per day. Default 4; `0` turns them off |
| `/breathe lang el\|en\|auto` | Language. `auto` (default) follows the language you write in |
| `/breathe signals on\|off` | Suggestions when work gets stuck. Off by default |
| `/breathe ai on\|off` | An extra AI check for better-timed suggestions. Off by default; asks for consent |
| `/breathe status` | Current settings and active time |
| `/breathe preview` | Show the suggestion card now (not counted) |
| `/breathe help` | The guide, in your language |

**In the panel:** `1`–`6` pick a category · `Tab` moves · `Enter` selects · **The research** shows the study behind the break.

## When it suggests a break

A card appears above the prompt, only when Claude is **not running anything**:

- after **90 minutes of active work** (a pause over 15 minutes resets the count), or
- with signals on, when your messages show the work is stuck: two "still fails" within 10 minutes, or a direct "I'm stuck", "this is so frustrating" or "my eyes are tired".

Always within your daily limit, at least 45 minutes apart, never in quiet hours (20:00–08:00). On the card: **Start** · **Another idea** · **Later** (15/30/60′) · **No more today**.

## The AI check (optional)

With signals on, the mod reads short phrases locally. If you also turn on the AI check, then, when those phrases suggest friction, up to 5 recent typed messages go to Claude Haiku, through Claude Code's own connection and credentials, to confirm before a card is shown. "Focused" means no card. Nothing is stored. See [PRIVACY.md](PRIVACY.md).

**For organisations:** set the plugin option `profile` to `enterprise` to lock the AI check off.

## The evidence

Every break has a claim, a source with DOI and an evidence level:

- **A** Strong evidence: meta-analysis or consistent trials
- **B** Good evidence: at least one good controlled trial
- **C** Early findings

Each claim says what the research found. Study details and limitations are in [`spec/actions.yaml`](spec/actions.yaml).

## Privacy

Your messages are never stored. Nothing is sent anywhere unless you turn on the AI check and agree. Full details: [PRIVACY.md](PRIVACY.md).

## Not medical advice

These are short, optional pauses. Stop if anything feels uncomfortable, and follow any advice you have from a professional.

## Development

```bash
claude plugin validate .   # manifest and hooks
claude plugin test .       # tests in tests/
python3 build-catalog.py   # regenerate hooks/catalog.ts and hooks/copy.ts after editing spec/actions.yaml or spec/ui-copy.yaml
```

The `spec/` folder is the source of truth: the catalogue of breaks, selection rules, friction signals and all user-facing copy.

## License

MIT © 2026 Princess M · Dalvì
