# Privacy · Dalvì Interlude

*Ελληνικά πιο κάτω.*

Dalvì Interlude is a Claude Code mod. It runs on your computer, inside Claude Code, with the same access Claude Code has. This page says exactly what it reads, keeps and sends.

## In short

- **Your messages are never stored** by this mod, in any mode.
- **Nothing is sent anywhere** unless you turn on the optional AI check yourself and agree to it.
- **No analytics, no telemetry, no accounts, no network calls of its own.**

## What it reads

| When | What | Why |
|---|---|---|
| Always | The time of each message you type (not the text) | To count active work time |
| Language set to `auto` (the default) | The letters of your latest message, in memory; before that, your device's locale setting | To answer in Greek or English |
| `/breathe signals on` (off by default) | Your latest message, in memory, skipping code, logs and quotes | To notice short phrases like "still fails" or "I'm stuck" |
| `/breathe ai on` + `agree` (off by default) | Up to your 5 most recent messages, in memory | To send them for the AI check below |

Only prompts you type are read, in the terminal or from your own remote client (including any a plugin submits on your behalf as you): never headless `claude -p` or SDK runs, messages relayed from channels or other sessions, scheduled prompts, or other plugins' own prompts. Reading happens in memory and is discarded right away. What the mod keeps from signals is only **which kind of cue** appeared (for example "unchanged failure") **and when**, never the words. It forgets these after 10 minutes, after an idle pause, or when you turn signals off.

## What it keeps on your computer

Stored by Claude Code's own plugin storage, on your machine:

- your settings (daily limit, language, signals on/off, AI check on/off)
- today's counters (suggestions shown, snooze, "no more today")
- which breaks were suggested recently and when, so they rotate

No message text, no AI results and no inferred state are ever stored.

## What it sends, and only if you choose

The **AI check** is off by default. When you run `/breathe ai on`, the mod shows what it does and waits for `/breathe ai agree`. Then:

- While it is on, your last 5 typed messages are held **in memory only**, in full.
- Only when the local signals already suggest the work is stuck, those messages (with fenced code blocks, quotes and log-like lines removed, and each cut to 600 characters) are sent to **Claude Haiku**. Other pasted text, such as unfenced config or JSON, may be included, so keep secrets out of prompts as you would anyway.
- The request goes through **Claude Code's own connection and credentials**. The mod has no API key and no server of its own. It counts toward your own usage.
- The model answers with one word about the work (for example "stuck" or "focused") and a confidence. The mod uses it to decide whether to show a card, then **discards it**.
- Your provider (Anthropic, or your organisation's cloud provider such as Amazon Bedrock or Google Vertex AI) processes the request like any other message you send, under its terms and your account's settings.
- Why a card was shown is kept only in the mod's own memory, not in state other plugins can read, and is gone when the session ends.
- Turning the AI check on also turns on local friction signals; turning signals off also turns the AI check off.

Turn it off anytime with `/breathe ai off`. This also clears the recent messages from memory.

**Enterprise profile:** when the plugin's `profile` setting is `enterprise`, the AI check is locked off and can't be turned on.

## Not medical advice

The breaks are short and optional, based on published research. They are not treatment for any condition.

## Contact

Issues and questions: https://github.com/LiTseri/dalvi-interlude/issues

---

# Ιδιωτικότητα · Dalvì Interlude

Το Dalvì Interlude είναι mod του Claude Code. Τρέχει στον υπολογιστή σου, μέσα στο Claude Code, με την ίδια πρόσβαση που έχει το Claude Code.

## Με μια ματιά

- **Τα μηνύματά σου δεν αποθηκεύονται ποτέ** από το mod, σε καμία λειτουργία.
- **Τίποτα δεν στέλνεται πουθενά**, εκτός αν ενεργοποιήσεις εσύ τον προαιρετικό έλεγχο AI και συμφωνήσεις.
- **Καμία ανάλυση χρήσης, κανένας λογαριασμός, καμία δική του σύνδεση στο δίκτυο.**

## Τι διαβάζει

- **Πάντα:** την ώρα κάθε μηνύματος (όχι το κείμενο), για να μετρά τον ενεργό χρόνο.
- **Γλώσσα `auto` (προεπιλογή):** τα γράμματα του τελευταίου μηνύματος, στη μνήμη, για να απαντά στα ελληνικά ή στα αγγλικά. Πριν από αυτό, η γλώσσα του συστήματός σου.
- **`/breathe signals on` (κλειστό αρχικά):** το τελευταίο μήνυμα, στη μνήμη, χωρίς κώδικα, logs και παραθέσεις, για φράσεις όπως «ακόμα δεν δουλεύει» ή «έχω κολλήσει». Κρατά μόνο **τι είδους** ένδειξη εμφανίστηκε και **πότε**, ποτέ τις λέξεις, και τα ξεχνά μετά από 10 λεπτά.
- **`/breathe ai on` + `agree` (κλειστό αρχικά):** έως τα 5 τελευταία μηνύματα, στη μνήμη, για τον έλεγχο AI.

## Τι κρατά στον υπολογιστή σου

Ρυθμίσεις, τους μετρητές της ημέρας, και ποια διαλείμματα προτάθηκαν πρόσφατα. Ποτέ κείμενο μηνυμάτων ή αποτελέσματα του AI. Το γιατί εμφανίστηκε μια κάρτα μένει μόνο στη μνήμη του mod, όχι σε κοινή κατάσταση που διαβάζουν άλλα plugins, και χάνεται στο τέλος της συνεδρίας.

## Τι στέλνει, μόνο αν το επιλέξεις

Όσο είναι ενεργό, τα 5 τελευταία μηνύματα που γράφεις κρατιούνται **μόνο στη μνήμη**, ολόκληρα. Όταν τα τοπικά σήματα δείχνουν ήδη ότι η δουλειά κόλλησε, στέλνονται στο **Claude Haiku** (χωρίς μπλοκ κώδικα σε ```, παραθέσεις και γραμμές log, έως 600 χαρακτήρες το καθένα· άλλο επικολλημένο κείμενο, π.χ. config ή JSON χωρίς ```, μπορεί να περιλαμβάνεται), μέσα από τη σύνδεση και τα διαπιστευτήρια του ίδιου του Claude Code, και μετράνε στη δική σου χρήση. Η απάντηση χρησιμοποιείται για μία απόφαση και **πετιέται**. Ο πάροχός σου (η Anthropic ή ο cloud πάροχος του οργανισμού σου) επεξεργάζεται το αίτημα όπως κάθε άλλο μήνυμά σου, με τους δικούς του όρους. Διαβάζονται μόνο μηνύματα που γράφεις εσύ (στο terminal ή από δικό σου απομακρυσμένο client), ποτέ headless `claude -p`/SDK, μηνύματα από κανάλια ή άλλες συνεδρίες, προγραμματισμένα prompts ή prompts άλλων plugins. Το άνοιγμα του ελέγχου AI ανοίγει και τις τοπικές ενδείξεις τριβής· το κλείσιμο των ενδείξεων κλείνει και τον έλεγχο AI. Το κλείνεις όποτε θέλεις με `/breathe ai off`.

**Profile `enterprise`:** ο έλεγχος AI είναι κλειδωμένος κλειστός.

## Δεν είναι ιατρική συμβουλή

Τα διαλείμματα είναι σύντομα, προαιρετικά και βασίζονται σε δημοσιευμένη έρευνα. Δεν είναι θεραπεία για καμία πάθηση.
