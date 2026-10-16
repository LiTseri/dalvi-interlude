# Contributing

Thank you for helping. Issues and pull requests are welcome at https://github.com/LiTseri/dalvi-interlude.

## Where things live

| You want to change | Edit | Then |
|---|---|---|
| A break: its steps, claim, source or timing | `spec/actions.yaml` | `python3 build-catalog.py` |
| Text on the card or panel | `spec/ui-copy.yaml` | `python3 build-catalog.py` |
| Friction phrases, the AI-check consent text, signal → category mapping | `spec/signals.yaml` | `python3 build-catalog.py` |
| Timing and gates (90 minutes, quiet hours, limits) | `spec/rules.yaml` **and** `RULES` in `hooks/select.ts` | keep both in step |
| Behaviour, commands, UI | `hooks/*.ts(x)` | add or update a test |

Never edit `hooks/catalog.ts`, `hooks/copy.ts` or `hooks/signals-data.ts` by hand: they are generated.

## Before you open a pull request

```bash
python3 build-catalog.py --check   # generated files match spec/
claude plugin validate .           # the engine accepts the manifest and module
claude plugin test .               # all tests pass
```

## House rules

- **Claims stay honest.** Each break's claim says what the research found, never what will happen to the reader. A new break needs a published source with a DOI, an evidence level (A, B or C) and its limitations in `spec/actions.yaml`.
- **Both languages.** Every user-facing string exists in Greek and English, written naturally in each, not translated word for word.
- **Privacy does not regress.** No prompt text in storage, no new outside calls, nothing sent without explicit consent. If a change touches what is read, kept or sent, update [PRIVACY.md](PRIVACY.md) in the same pull request.
- **Never in the way.** Automatic cards only at the end of a turn the person started, and only through the gates in `spec/rules.yaml`.
- Add a line to [CHANGELOG.md](CHANGELOG.md) under "Unreleased".
