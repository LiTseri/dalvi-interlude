// GENERATED from spec/signals.yaml by build-catalog.py. Do not edit by hand.
import type { Category, Signal } from "../types"

export const CUE_PHRASES = {
 "frustrated": [
  "με εκνευρίζει",
  "έχω εκνευριστεί",
  "δεν αντέχω άλλο",
  "με έχει τρελάνει",
  "έχω τρελαθεί",
  "so frustrating",
  "i'm frustrated",
  "i am frustrated",
  "can't stand this",
  "driving me crazy"
 ],
 "unchanged_failure": [
  "ακόμα δεν δουλεύει",
  "πάλι δεν δουλεύει",
  "ακόμα δεν δούλεψε",
  "ίδιο σφάλμα",
  "ίδιο λάθος",
  "δεν άλλαξε τίποτα",
  "still not working",
  "still doesn't work",
  "still does not work",
  "still fails",
  "still failing",
  "still broken",
  "same error",
  "nothing changed"
 ],
 "stuck_report": [
  "έχω κολλήσει",
  "κόλλησα",
  "δεν ξέρω τι άλλο να",
  "τίποτα δεν δούλεψε",
  "καμία λύση δεν",
  "i'm stuck",
  "i am stuck",
  "don't know what else to",
  "do not know what else to",
  "nothing worked",
  "none of the fixes"
 ],
 "fatigued": [
  "κουράστηκαν τα μάτια μου",
  "δεν μπορώ να συγκεντρωθώ",
  "χρειάζομαι διάλειμμα",
  "έχω κουραστεί",
  "είμαι κουρασμένη",
  "είμαι κουρασμένος",
  "my eyes are tired",
  "my eyes feel tired",
  "can't focus",
  "cannot focus",
  "need a break",
  "i'm tired",
  "i am tired",
  "i'm exhausted"
 ]
} as const

export const SUCCESS_PHRASES: readonly string[] = [
 "τώρα δουλεύει",
 "δουλεύει τώρα",
 "λύθηκε",
 "διορθώθηκε",
 "δούλεψε",
 "τέλεια",
 "works now",
 "it works",
 "fixed now",
 "that worked",
 "that fixed it",
 "solved",
 "perfect"
]

export const SIGNAL_MAPPING: Record<Signal, readonly Category[]> = {
 "stuck": [
  "movement",
  "mind"
 ],
 "frustrated": [
  "breathing",
  "mind"
 ],
 "fatigued": [
  "eyes",
  "movement",
  "hydration"
 ],
 "long_session": [
  "movement",
  "eyes",
  "mind",
  "hydration"
 ]
}

export const AI_CONSENT = {
 "el": "Αν το ενεργοποιήσεις: όταν φαίνεται ότι η δουλειά κόλλησε, έως 5 πρόσφατα μηνύματά σου στέλνονται στο Claude Haiku, για να κρίνει αν ταιριάζει ένα διάλειμμα. Πριν σταλούν αφαιρούνται τα μπλοκ κώδικα σε ```, οι παραθέσεις και οι γραμμές log, και το καθένα κόβεται στους 600 χαρακτήρες· άλλο επικολλημένο κείμενο, π.χ. config ή JSON χωρίς ```, μπορεί να συμπεριληφθεί. Η αποστολή γίνεται μέσα από την ίδια σύνδεση και τα ίδια διαπιστευτήρια που ήδη χρησιμοποιεί το Claude Code και μετράει στη δική σου χρήση. Ο πάροχος (η Anthropic ή ο cloud πάροχος του οργανισμού σου) το επεξεργάζεται όπως κάθε άλλο μήνυμά σου, με τους δικούς του όρους. Το εργαλείο δεν αποθηκεύει ούτε τα μηνύματα ούτε το αποτέλεσμα. Ενεργοποιούνται επίσης οι τοπικές ενδείξεις τριβής (/breathe signals).",
 "en": "If you turn this on: when work seems stuck, up to 5 of your recent messages are sent to Claude Haiku to judge whether a break fits. Before sending, fenced code blocks, quotes and log lines are removed and each message is cut to 600 characters; other pasted text, such as config or JSON without ```, may be included. It goes through the same connection and credentials Claude Code already uses and counts toward your own usage. The provider (Anthropic, or your organisation's cloud provider) processes it like any other message of yours, under its own terms. This tool stores neither the messages nor the result. Local friction signals (/breathe signals) are turned on too."
} as const
