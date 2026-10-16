# Security

## Reporting a vulnerability

Please report security issues **privately**, not in a public issue:

1. Open the repository on GitHub: https://github.com/LiTseri/dalvi-interlude
2. Go to **Security → Report a vulnerability**.
3. Describe what you found and, if you can, how to reproduce it.

I aim to reply within 7 days. Once a fix is ready it is released as a new version, and you are credited in the [changelog](CHANGELOG.md) unless you prefer not to be.

## Supported versions

Only the latest version receives fixes. Plugins installed from the Claude directory update on their own.

## What the mod can and cannot do

Knowing the boundaries helps judge a report:

- It runs inside Claude Code as a mod (function hooks), with no network calls of its own, no API keys and no server.
- It reads only the prompts you type, in memory. It never reads files, runs commands or changes your prompts.
- The only outside call is the optional AI check, made through Claude Code's own model connection after your explicit consent (see [PRIVACY.md](PRIVACY.md)).
- It stores settings, daily counters and recent break ids through Claude Code's plugin storage. Never message text.
