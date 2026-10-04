// GENERATED from spec/actions.yaml by build-catalog. Do not edit by hand.
import type { Action } from "../types"

export const ACTIONS: Action[] = [
 {
  "id": "cyclic-sighing",
  "title": {
   "el": "Πάρε μια ανάσα",
   "en": "Take a breather"
  },
  "category": "breathing",
  "durationSec": 300,
  "ui": "guided_timer",
  "steps": {
   "el": [
    "Κάθισε όπως σε βολεύει και άφησε τη δουλειά στην άκρη για πέντε λεπτά.",
    "Πάρε αέρα από τη μύτη και, πριν εκπνεύσεις, πρόσθεσε μια δεύτερη, μικρή εισπνοή, πάλι από τη μύτη.",
    "Βγάλε αργά τον αέρα από το στόμα, αφήνοντας την εκπνοή λίγο μεγαλύτερη σε διάρκεια από την εισπνοή.",
    "Συνέχισε απαλά, με κανονικές αναπνοές ενδιάμεσα όποτε θέλεις."
   ],
   "en": [
    "Find a comfortable seat and set work aside for five minutes.",
    "Breathe in through your nose, then add a small second inhale through your nose before breathing out.",
    "Breathe out slowly through your mouth, letting the exhale last a little longer than the inhale.",
    "Continue gently, taking normal breaths in between whenever you like."
   ]
  },
  "claim": {
   "el": "Σε μελέτη 28 ημερών, πέντε λεπτά καθημερινής εξάσκησης συνδέθηκαν με μεγαλύτερη βελτίωση θετικής διάθεσης από το mindfulness.",
   "en": "In a 28-day study, five minutes of daily practice was linked to a greater improvement in positive mood than mindfulness."
  },
  "level": "B",
  "source": {
   "citation": "Yilmaz Balban MY et al., 2023, Cell Reports Medicine",
   "doi": "10.1016/j.xcrm.2022.100895"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated",
   "stuck",
   "long_session"
  ],
  "tags": [
   "office-friendly",
   "seated",
   "breathwork"
  ],
  "cautions": {
   "el": "Ήπια, χωρίς πίεση· αν ζαλιστείς, δυσφορήσεις ή σου λείψει αέρας, σταμάτα και ανάπνεε φυσιολογικά.",
   "en": "Keep it gentle and unforced; if you feel dizzy, uncomfortable or short of breath, stop and breathe normally."
  },
  "cooldownMin": 120
 },
 {
  "id": "easy-paced-breathing",
  "title": {
   "el": "Ανάσες σε ήρεμο ρυθμό",
   "en": "An easy breathing rhythm"
  },
  "category": "breathing",
  "durationSec": 300,
  "ui": "guided_timer",
  "steps": {
   "el": [
    "Βρες μια άνετη θέση στην καρέκλα και άφησε τους ώμους να χαλαρώσουν.",
    "Αν σου είναι άνετο, πάρε αέρα για περίπου πέντε δευτερόλεπτα και βγάλε τον για άλλα πέντε, χωρίς κράτημα.",
    "Συνέχισε για πέντε λεπτά με ήπιες αναπνοές, χωρίς πολύ αέρα ή τέλειο μέτρημα."
   ],
   "en": [
    "Settle into your chair and let your shoulders relax.",
    "If comfortable, breathe in for about five seconds and out for five, without holding your breath.",
    "Continue gently for five minutes, without taking big breaths or trying to keep perfect time."
   ]
  },
  "claim": {
   "el": "Σε ανάλυση 31 μελετών, η αργή αναπνοή χαμήλωσε τους παλμούς και την πίεση εκείνη τη στιγμή.",
   "en": "Across 31 studies, slow breathing lowered heart rate and blood pressure in the moment."
  },
  "level": "A",
  "source": {
   "citation": "Shao R, Man ISC, Lee TMC, 2024, Mindfulness",
   "doi": "10.1007/s12671-023-02294-2"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated",
   "long_session"
  ],
  "tags": [
   "silent",
   "office-friendly",
   "seated",
   "no-breath-hold"
  ],
  "cautions": {
   "el": "Ήπια, χωρίς πίεση· αν ζαλιστείς, δυσφορήσεις ή σου λείψει αέρας, σταμάτα και ανάπνεε φυσιολογικά.",
   "en": "Keep it gentle and unforced; if you feel dizzy, uncomfortable or short of breath, stop and breathe normally."
  },
  "cooldownMin": 120
 },
 {
  "id": "box-breathing",
  "title": {
   "el": "Αναπνοή σε τέσσερα βήματα",
   "en": "Breathe in four steps"
  },
  "category": "breathing",
  "durationSec": 300,
  "ui": "guided_timer",
  "steps": {
   "el": [
    "Κάθισε άνετα για μια αναπνοή με δύο μικρές παύσεις.",
    "Πάρε αέρα για τέσσερα δευτερόλεπτα, κράτησέ τον απαλά για τέσσερα, βγάλε τον για τέσσερα και περίμενε άλλα τέσσερα.",
    "Συνέχισε για έως πέντε λεπτά, όσο σου είναι άνετο.",
    "Αν οι παύσεις σε δυσκολεύουν, μπορείς να διαλέξεις αναπνοή χωρίς κράτημα."
   ],
   "en": [
    "Sit comfortably for a breathing pattern with two short pauses.",
    "Breathe in for four seconds, hold gently for four, breathe out for four, then pause for four.",
    "Continue for up to five minutes, only while comfortable.",
    "If the pauses feel difficult, choose a breathing exercise without holds."
   ]
  },
  "claim": {
   "el": "Σε μελέτη ενός μήνα με πεντάλεπτη καθημερινή εξάσκηση, οι συμμετέχοντες ανέφεραν λιγότερο άγχος μετά την άσκηση.",
   "en": "In a month-long study of five-minute daily practice, participants reported feeling less anxious after the exercise."
  },
  "level": "C",
  "source": {
   "citation": "Yilmaz Balban MY et al., 2023, Cell Reports Medicine",
   "doi": "10.1016/j.xcrm.2022.100895"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated"
  ],
  "tags": [
   "silent",
   "seated",
   "manual-only",
   "breath-holds"
  ],
  "cautions": {
   "el": "Ήπια, χωρίς πίεση· αν ζαλιστείς, δυσφορήσεις ή σου λείψει αέρας, σταμάτα και ανάπνεε φυσιολογικά. Παράλειψέ το αν το κράτημα σε δυσκολεύει.",
   "en": "Keep it gentle and unforced; if you feel dizzy, uncomfortable or short of breath, stop and breathe normally. Skip this if breath holds feel difficult."
  },
  "cooldownMin": 120
 },
 {
  "id": "small-walking-loop",
  "title": {
   "el": "Βόλτα χωρίς προορισμό",
   "en": "A walk with no destination"
  },
  "category": "movement",
  "durationSec": 120,
  "ui": "text",
  "steps": {
   "el": [
    "Αν το περπάτημα σου είναι άνετο, μπορείς να σηκωθείς για μια μικρή βόλτα.",
    "Περπάτησε χαλαρά για δύο λεπτά, αφήνοντας το κινητό στο γραφείο αν θέλεις.",
    "Η λύση μπορεί να περιμένει όσο περπατάς, κι εσύ επιστρέφεις όποτε θέλεις."
   ],
   "en": [
    "If walking feels comfortable, get up for a little wander.",
    "Walk at an easy pace for two minutes, leaving your phone at the desk if you like.",
    "The answer can wait while you walk, and you can return whenever you like."
   ]
  },
  "claim": {
   "el": "Σε μελέτη, δίλεπτο περπάτημα κάθε είκοσι λεπτά περιόρισε την άνοδο του σακχάρου μετά το φαγητό.",
   "en": "In a study, two-minute walks every twenty minutes reduced the rise in blood sugar after a meal."
  },
  "level": "B",
  "source": {
   "citation": "Dunstan DW et al., 2012, Diabetes Care",
   "doi": "10.2337/dc11-1931"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "stuck",
   "fatigued"
  ],
  "tags": [
   "walking",
   "office-friendly",
   "screen-free",
   "low-demand"
  ],
  "cautions": {
   "el": "Διάλεξε ασφαλή διαδρομή· αν το περπάτημα δεν σου ταιριάζει, μια καθιστή παύση είναι επίσης επιλογή.",
   "en": "Choose a safe route; if walking does not suit you, try a seated pause."
  },
  "cooldownMin": 90
 },
 {
  "id": "gentle-movement-circuit",
  "title": {
   "el": "Λίγη κίνηση δίπλα σου",
   "en": "A little room to move"
  },
  "category": "movement",
  "durationSec": 180,
  "ui": "text",
  "steps": {
   "el": [
    "Στάσου δίπλα σε κάτι σταθερό, όπου μπορείς να στηριχτείς.",
    "Δοκίμασε να σηκωθείς απαλά στις μύτες ή να σηκώσεις λίγο τα γόνατα εναλλάξ.",
    "Μια ακόμη επιλογή είναι να λυγίσεις λίγο τα γόνατα, σαν να ξεκινάς να κάθεσαι.",
    "Συνδύασε μόνο τις άνετες κινήσεις αργά για έως τρία λεπτά, με παύσεις και χωρίς μέτρημα."
   ],
   "en": [
    "Stand beside something stable you can hold for support.",
    "Try gently rising onto your toes or lifting your knees a little, one at a time.",
    "Another option is a small knee bend, as though starting to sit down.",
    "Alternate comfortable movements slowly for up to three minutes, taking rests without counting repetitions."
   ]
  },
  "claim": {
   "el": "Σε μελέτη, τρίλεπτη ελαφριά κίνηση κάθε μισή ώρα περιόρισε την άνοδο του σακχάρου μετά το φαγητό.",
   "en": "In a study, three minutes of light movement every half-hour reduced the rise in blood sugar after meals."
  },
  "level": "C",
  "source": {
   "citation": "Dempsey PC et al., 2016, Diabetes Care",
   "doi": "10.2337/dc15-2336"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "standing",
   "movement",
   "screen-free",
   "manual-only"
  ],
  "cautions": {
   "el": "Άφησε όποια κίνηση προκαλεί πόνο ή αστάθεια και ακολούθησε τυχόν οδηγίες που περιορίζουν τις κινήσεις σου.",
   "en": "Skip any movement that causes pain or instability, and follow any movement restrictions you have."
  },
  "cooldownMin": 90
 },
 {
  "id": "under-desk-motion",
  "title": {
   "el": "Μικρή κίνηση, χωρίς να σηκωθείς",
   "en": "A little movement, still seated"
  },
  "category": "movement",
  "durationSec": 60,
  "ui": "text",
  "steps": {
   "el": [
    "Μείνε άνετα στην καρέκλα, με τα πόδια στο πάτωμα.",
    "Σήκωνε και χαμήλωνε απαλά τις φτέρνες, κρατώντας τις μύτες στο πάτωμα.",
    "Συνέχισε για ένα λεπτό στον δικό σου ρυθμό, αφήνοντας τη δουλειά για λίγο αν θέλεις."
   ],
   "en": [
    "Stay comfortably seated with your feet on the floor.",
    "Gently raise and lower your heels, keeping your toes on the floor.",
    "Continue at your own pace for one minute, setting work aside if you like."
   ]
  },
  "claim": {
   "el": "Σε τρίωρη μελέτη, ένα λεπτό κίνησης ανά πέντε λεπτά βοήθησε να διατηρηθεί η λειτουργία των αγγείων του κινούμενου ποδιού.",
   "en": "In a three-hour study, moving one leg for a minute every five minutes helped preserve how its blood vessels responded."
  },
  "level": "C",
  "source": {
   "citation": "Morishima T et al., 2016, American Journal of Physiology—Heart and Circulatory Physiology",
   "doi": "10.1152/ajpheart.00297.2016"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "silent",
   "seated",
   "office-friendly",
   "screen-free"
  ],
  "cautions": {
   "el": "Μόνο άνετη κίνηση, χωρίς πόνο· αν δεν σου ταιριάζει, διάλεξε άλλη παύση.",
   "en": "Keep movement comfortable and pain-free; choose another pause if this does not suit you."
  },
  "cooldownMin": 60
 },
 {
  "id": "change-of-height",
  "title": {
   "el": "Μια αλλαγή στάσης",
   "en": "Stand for a moment"
  },
  "category": "movement",
  "durationSec": 120,
  "ui": "text",
  "steps": {
   "el": [
    "Αν σου είναι άνετο, στάσου για δύο λεπτά δίπλα στο γραφείο.",
    "Άφησε τα γόνατα χαλαρά και μετακίνησε απαλά το βάρος σου από το ένα πόδι στο άλλο.",
    "Μπορείς να καθίσεις ξανά όποτε θέλεις ή να κάνεις λίγα βήματα."
   ],
   "en": [
    "If comfortable, stand beside your desk for two minutes.",
    "Keep your knees relaxed and gently shift your weight from one foot to the other.",
    "Sit down whenever you like, or take a few steps if you prefer."
   ]
  },
  "claim": {
   "el": "Σε επτά μελέτες, τα διαλείμματα ορθοστασίας περιόρισαν λίγο την άνοδο του σακχάρου μετά το φαγητό, ενώ το περπάτημα βοήθησε περισσότερο.",
   "en": "Across seven studies, standing breaks modestly reduced blood sugar rises after meals, with walking offering a greater benefit."
  },
  "level": "C",
  "source": {
   "citation": "Buffey AJ et al., 2022, Sports Medicine",
   "doi": "10.1007/s40279-022-01649-4"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session"
  ],
  "tags": [
   "standing",
   "silent",
   "office-friendly",
   "screen-free"
  ],
  "cautions": {
   "el": "Παράλειψέ το αν η ορθοστασία προκαλεί πόνο, ζάλη ή αστάθεια.",
   "en": "Skip this if standing causes pain, dizziness or instability."
  },
  "cooldownMin": 90
 },
 {
  "id": "thirst-first",
  "title": {
   "el": "Μια γουλιά νερό;",
   "en": "A sip of water?"
  },
  "category": "hydration",
  "durationSec": 60,
  "ui": "text",
  "steps": {
   "el": [
    "Αν διψάς και έχεις νερό δίπλα σου, μπορείς να πιεις μερικές γουλιές.",
    "Αν δεν διψάς, δεν χρειάζεται να πιεις νερό.",
    "Κράτησε ένα λεπτό για την παύση, με ή χωρίς νερό."
   ],
   "en": [
    "If you feel thirsty and have water nearby, take a few sips.",
    "If you are not thirsty, there is no need to drink.",
    "Take a minute to pause, with or without water."
   ]
  },
  "claim": {
   "el": "Μετά από μια νύχτα χωρίς υγρά, όσοι διψούσαν ανταποκρίθηκαν γρηγορότερα σε απλό τεστ όταν ήπιαν νερό.",
   "en": "After a night without fluids, thirsty participants responded faster on a simple test when they drank water."
  },
  "level": "C",
  "source": {
   "citation": "Edmonds CJ, Crombie R, Gardner MR, 2013, Frontiers in Human Neuroscience",
   "doi": "10.3389/fnhum.2013.00363"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "seated",
   "office-friendly",
   "water",
   "no-volume-target"
  ],
  "cautions": {
   "el": "Αν έχεις οδηγίες να περιορίζεις τα υγρά, ακολούθησέ τες· η κούραση από μόνη της δεν σημαίνει ανάγκη για νερό.",
   "en": "Follow any advice to limit fluids; feeling tired alone does not mean you need water."
  },
  "cooldownMin": 180
 },
 {
  "id": "water-side-quest",
  "title": {
   "el": "Μια βόλτα για νερό",
   "en": "A little walk for water"
  },
  "category": "hydration",
  "durationSec": 120,
  "ui": "text",
  "steps": {
   "el": [
    "Αν θέλεις νερό, άφησε το γραφείο και πήγαινε να γεμίσεις το ποτήρι σου.",
    "Πιες όσο σου είναι άνετο αν διψάς, χωρίς να χρειάζεται να αδειάσεις το ποτήρι.",
    "Κράτησε περίπου δύο λεπτά για τη διαδρομή, ή κάνε απλώς μια βόλτα αν δεν θέλεις νερό."
   ],
   "en": [
    "If you want water, step away from your desk to refill your glass.",
    "Drink a comfortable amount if thirsty, without needing to finish the glass.",
    "Allow about two minutes for the trip, or simply take a walk if you do not want water."
   ]
  },
  "claim": {
   "el": "Σε μελέτη μετά από ώρες χωρίς νερό, ένα ποτήρι νερό μείωσε τη δίψα και ορισμένα δυσάρεστα συναισθήματα.",
   "en": "In a study after hours without water, a glass of water eased thirst and some unpleasant feelings."
  },
  "level": "C",
  "source": {
   "citation": "Zhang J et al., 2020, International Journal of Environmental Research and Public Health",
   "doi": "10.3390/ijerph17217792"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "walking",
   "water",
   "screen-free",
   "no-volume-target"
  ],
  "cautions": {
   "el": "Ακολούθησε τυχόν οδηγίες περιορισμού υγρών· αν η διαδρομή δεν σου είναι εφικτή, διάλεξε μια παύση στην καρέκλα.",
   "en": "Follow any advice to limit fluids; if the route is inaccessible, choose a seated pause."
  },
  "cooldownMin": 180
 },
 {
  "id": "look-beyond-the-screen",
  "title": {
   "el": "Κοίτα λίγο πιο μακριά",
   "en": "Let your gaze wander"
  },
  "category": "eyes",
  "durationSec": 60,
  "ui": "text",
  "steps": {
   "el": [
    "Άφησε την οθόνη και κοίτα ένα μακρινό σημείο, περίπου έξι μέτρα μακριά αν υπάρχει.",
    "Κοίταξέ το για είκοσι δευτερόλεπτα, με χαλαρό βλέμμα.",
    "Για το υπόλοιπο λεπτό, κοίτα γύρω σου και άφησε το κινητό για μετά."
   ],
   "en": [
    "Look away from the screen at a distant point, roughly six metres away if available.",
    "Rest your gaze there for twenty seconds.",
    "For the rest of the minute, look around you and leave your phone for later."
   ]
  },
  "claim": {
   "el": "Σε μελέτη δύο εβδομάδων, όσοι είχαν υπενθυμίσεις 20-20-20 ανέφεραν λιγότερη ενόχληση στα μάτια.",
   "en": "In a two-week study, people with 20-20-20 reminders reported less eye discomfort."
  },
  "level": "C",
  "source": {
   "citation": "Talens-Estarelles C et al., 2023, Contact Lens and Anterior Eye",
   "doi": "10.1016/j.clae.2022.101744"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "silent",
   "seated",
   "office-friendly",
   "screen-free",
   "visual-rest"
  ],
  "cautions": {
   "el": "Μην κοιτάζεις τον ήλιο ή έντονο φως· αν η ενόχληση επιμένει, χρειάζεται έλεγχος πέρα από το διάλειμμα.",
   "en": "Avoid looking at the sun or bright light; persistent symptoms need assessment beyond a screen break."
  },
  "cooldownMin": 60
 },
 {
  "id": "unhurried-blinks",
  "title": {
   "el": "Κλείσε απαλά τα μάτια",
   "en": "A gentle blink"
  },
  "category": "eyes",
  "durationSec": 60,
  "ui": "text",
  "steps": {
   "el": [
    "Κοίτα για λίγο μακριά από την οθόνη.",
    "Κλείσε απαλά τα μάτια για δύο δευτερόλεπτα, χωρίς σφίξιμο, και άνοιξέ τα ξανά.",
    "Επανάλαβε λίγες φορές μέσα στο λεπτό, ανοιγοκλείνοντας τα μάτια κανονικά ενδιάμεσα."
   ],
   "en": [
    "Look away from the screen for a moment.",
    "Gently close your eyes for two seconds without squeezing, then open them again.",
    "Repeat a few times over the minute, blinking normally in between."
   ]
  },
  "claim": {
   "el": "Μετά από τέσσερις εβδομάδες ασκήσεων βλεφαρισμού, οι συμμετέχοντες ανέφεραν λιγότερη ενόχληση στα μάτια.",
   "en": "After four weeks of blinking exercises, participants reported less eye discomfort."
  },
  "level": "C",
  "source": {
   "citation": "Kim AD et al., 2021, Contact Lens and Anterior Eye",
   "doi": "10.1016/j.clae.2020.04.014"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued"
  ],
  "tags": [
   "silent",
   "seated",
   "office-friendly",
   "screen-free"
  ],
  "cautions": {
   "el": "Χωρίς τρίψιμο ή πίεση στα μάτια· αν σε ενοχλεί, σταμάτα.",
   "en": "Avoid rubbing or pressing your eyes; stop if you feel discomfort."
  },
  "cooldownMin": 60
 },
 {
  "id": "unplanned-pause",
  "title": {
   "el": "Μια παύση χωρίς πρόγραμμα",
   "en": "A pause with no agenda"
  },
  "category": "mind",
  "durationSec": 180,
  "ui": "text",
  "steps": {
   "el": [
    "Άφησε τις οθόνες για τρία λεπτά και κάθισε όπως σε βολεύει.",
    "Μπορείς απλώς να ξεκουραστείς, χωρίς κάποια άσκηση να ακολουθήσεις.",
    "Ένα χρονόμετρο είναι προαιρετικό, κι εσύ επιστρέφεις όποτε θέλεις."
   ],
   "en": [
    "Set screens aside for three minutes and find a comfortable seat.",
    "You can simply rest, with no exercise to follow.",
    "A timer is optional, and you can return whenever you like."
   ]
  },
  "claim": {
   "el": "Σε ανάλυση 22 μελετών, τα σύντομα διαλείμματα μείωσαν την κούραση και ανέβασαν την ενέργεια.",
   "en": "Across 22 studies, short breaks reduced tiredness and raised energy."
  },
  "level": "A",
  "source": {
   "citation": "Albulescu P et al., 2022, PLOS ONE",
   "doi": "10.1371/journal.pone.0272460"
  },
  "times": [
   "any"
  ],
  "signals": [
   "long_session",
   "fatigued",
   "frustrated"
  ],
  "tags": [
   "silent",
   "seated",
   "office-friendly",
   "screen-free",
   "no-task"
  ],
  "cautions": {
   "el": "-",
   "en": "-"
  },
  "cooldownMin": 90
 },
 {
  "id": "let-the-problem-rest",
  "title": {
   "el": "Άφησέ το λίγο στην άκρη",
   "en": "Let the problem rest"
  },
  "category": "mind",
  "durationSec": 180,
  "ui": "text",
  "steps": {
   "el": [
    "Άφησε το θέμα που δουλεύεις στην άκρη για τρία λεπτά.",
    "Κάνε κάτι απλό και άσχετο, όπως λίγα βήματα ή λίγη τακτοποίηση στο γραφείο.",
    "Τα μηνύματα και τα άλλα δύσκολα θέματα μπορούν να περιμένουν, χωρίς να χρειάζεται να βρεις ιδέα στο διάλειμμα."
   ],
   "en": [
    "Set the problem you are working on aside for three minutes.",
    "Do something simple and unrelated, such as taking a few steps or tidying your desk.",
    "Messages and other demanding tasks can wait, with no need for an idea to arrive during the break."
   ]
  },
  "claim": {
   "el": "Σε ανάλυση ερευνών, η προσωρινή απομάκρυνση βοήθησε στην επίλυση προβλημάτων, με το όφελος να διαφέρει ανάλογα με την εργασία.",
   "en": "Across studies, stepping away helped with problem solving on average, with benefits varying by task."
  },
  "level": "C",
  "source": {
   "citation": "Sio UN, Ormerod TC, 2009, Psychological Bulletin",
   "doi": "10.1037/a0014212"
  },
  "times": [
   "any"
  ],
  "signals": [
   "stuck"
  ],
  "tags": [
   "office-friendly",
   "screen-free",
   "low-demand",
   "adapted-protocol"
  ],
  "cautions": {
   "el": "-",
   "en": "-"
  },
  "cooldownMin": 120
 },
 {
  "id": "forty-seconds-of-green",
  "title": {
   "el": "Λίγο πράσινο στο διάλειμμα",
   "en": "A moment of green"
  },
  "category": "mind",
  "durationSec": 60,
  "ui": "text",
  "steps": {
   "el": [
    "Διάλεξε μια φωτογραφία πράσινου τοπίου ή φυτεμένης στέγης που έχεις ήδη διαθέσιμη.",
    "Κράτησε περίπου είκοσι δευτερόλεπτα για να την ανοίξεις και σαράντα για να την κοιτάξεις ήρεμα.",
    "Μείνε σε αυτή τη φωτογραφία, χωρίς αναζήτηση άλλων εικόνων.",
    "Αν δεν έχεις κάποια διαθέσιμη, μπορείς να διαλέξεις άλλη ιδέα για διάλειμμα."
   ],
   "en": [
    "Choose an available photo of a green landscape or planted roof.",
    "Allow about twenty seconds to open it, then forty to look at it quietly.",
    "Stay with that photo, without searching for more pictures.",
    "If no photo is available, choose another break idea."
   ]
  },
  "claim": {
   "el": "Σε μελέτη, σαράντα δευτερόλεπτα εικόνας φυτεμένης στέγης υποστήριξαν καλύτερα την προσοχή σε μια εργασία από εικόνα τσιμεντένιας στέγης.",
   "en": "In a study, forty seconds viewing a planted roof supported sustained attention better than viewing a concrete roof."
  },
  "level": "B",
  "source": {
   "citation": "Lee KE et al., 2015, Journal of Environmental Psychology",
   "doi": "10.1016/j.jenvp.2015.04.003"
  },
  "times": [
   "any"
  ],
  "signals": [
   "stuck",
   "long_session"
  ],
  "tags": [
   "silent",
   "seated",
   "needs-image",
   "manual-only",
   "nature"
  ],
  "cautions": {
   "el": "Δεν ξέρουμε αν κάθε εικόνα έχει το ίδιο αποτέλεσμα· η φωτογραφία ανοίγει μόνο αν το επιλέξεις εσύ.",
   "en": "The effect may differ between pictures; your photo opens only when you choose to open it."
  },
  "cooldownMin": 120
 },
 {
  "id": "small-sound-window",
  "title": {
   "el": "Άκου λίγο τη φύση",
   "en": "Listen to a little nature"
  },
  "category": "mind",
  "durationSec": 180,
  "ui": "text",
  "steps": {
   "el": [
    "Διάλεξε μια διαθέσιμη ηχογράφηση με νερό που κυλά, πουλιά ή κάποιον άλλο ήχο της φύσης.",
    "Σε χαμηλή ένταση, άφησε την οθόνη και άκου για τρία λεπτά.",
    "Αν προτιμάς ησυχία, μπορείς να διαλέξεις τη «Μια παύση χωρίς πρόγραμμα»."
   ],
   "en": [
    "Choose an available recording of flowing water, birds or another nature sound.",
    "Keep the volume low, set the screen aside and listen for three minutes.",
    "If you prefer silence, choose “A pause with no agenda”."
   ]
  },
  "claim": {
   "el": "Σε ανάλυση ερευνών, οι ήχοι της φύσης συνδέθηκαν με πιο ευχάριστα συναισθήματα και λιγότερο στρες.",
   "en": "Across studies, nature sounds were linked to more pleasant feelings and less stress."
  },
  "level": "C",
  "source": {
   "citation": "Buxton RT et al., 2021, Proceedings of the National Academy of Sciences",
   "doi": "10.1073/pnas.2013097118"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated",
   "long_session"
  ],
  "tags": [
   "seated",
   "screen-free",
   "nature",
   "needs-audio",
   "manual-only"
  ],
  "cautions": {
   "el": "Σε άνετη ένταση και μόνο όπου επιτρέπεται· αν ο ήχος σε ενοχλεί, παράλειψέ το.",
   "en": "Use a comfortable volume where sound is allowed; skip this if it bothers you."
  },
  "cooldownMin": 120
 },
 {
  "id": "hands-shoulders-release",
  "title": {
   "el": "Λίγη χαλάρωση για τους μυς",
   "en": "Let your muscles rest"
  },
  "category": "mind",
  "durationSec": 300,
  "ui": "text",
  "steps": {
   "el": [
    "Κάθισε άνετα και δοκίμασε χέρια, ώμους και πόδια, ένα σημείο κάθε φορά.",
    "Σφίξε πολύ απαλά τους μυς για περίπου πέντε δευτερόλεπτα και χαλάρωσέ τους για δεκαπέντε, αναπνέοντας κανονικά.",
    "Επανάλαβε αργά για έως πέντε λεπτά, με μικρές παύσεις.",
    "Μπορείς να παραλείψεις όποιο σημείο σε δυσκολεύει ή απλώς να το χαλαρώσεις χωρίς σφίξιμο."
   ],
   "en": [
    "Sit comfortably and try your hands, shoulders and legs, one area at a time.",
    "Tense very gently for about five seconds, then release for fifteen, breathing normally.",
    "Repeat slowly for up to five minutes, with short rests.",
    "Skip any uncomfortable area, or simply let it relax without tensing."
   ]
  },
  "claim": {
   "el": "Σε μελέτη εικοσάλεπτης καθοδηγούμενης εξάσκησης, όσοι χαλάρωναν σταδιακά τους μυς ανέφεραν μεγαλύτερη χαλάρωση από όσους δεν έκαναν άσκηση.",
   "en": "In a study of twenty-minute guided practice, participants reported greater relaxation after gradually releasing muscle tension than those who did no exercise."
  },
  "level": "C",
  "source": {
   "citation": "Toussaint L et al., 2021, Evidence-Based Complementary and Alternative Medicine",
   "doi": "10.1155/2021/5924040"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated",
   "fatigued"
  ],
  "tags": [
   "silent",
   "seated",
   "screen-free",
   "manual-only",
   "adapted-protocol"
  ],
  "cautions": {
   "el": "Απόφυγε το σφίξιμο σε σημεία που πονάνε ή έχουν τραυματιστεί· κράτησέ το ήπιο και σταμάτα αν ενοχλεί.",
   "en": "Avoid tensing painful or injured areas; keep tension gentle and stop if uncomfortable."
  },
  "cooldownMin": 180
 },
 {
  "id": "notice-without-fixing",
  "title": {
   "el": "Πέντε λεπτά με την αναπνοή",
   "en": "Five minutes with your breath"
  },
  "category": "mind",
  "durationSec": 300,
  "ui": "guided_timer",
  "steps": {
   "el": [
    "Κάθισε όπως σε βολεύει, με τα μάτια ανοιχτά αν προτιμάς.",
    "Για πέντε λεπτά, παρατήρησε την αναπνοή σου χωρίς να αλλάξεις τον ρυθμό της.",
    "Αν η σκέψη σου γυρίσει στη δουλειά, επέστρεψε απαλά στην αναπνοή, όσες φορές κι αν συμβεί."
   ],
   "en": [
    "Find a comfortable seat, keeping your eyes open if you prefer.",
    "For five minutes, notice your breath without changing its rhythm.",
    "If your mind returns to work, gently come back to your breath, as often as you need."
   ]
  },
  "claim": {
   "el": "Σε μελέτη 28 ημερών με πεντάλεπτη καθημερινή εξάσκηση, οι συμμετέχοντες ανέφεραν λιγότερο άγχος μετά την παρατήρηση της αναπνοής.",
   "en": "In a 28-day study of five-minute daily practice, participants reported feeling less anxious after observing their breath."
  },
  "level": "B",
  "source": {
   "citation": "Yilmaz Balban MY et al., 2023, Cell Reports Medicine",
   "doi": "10.1016/j.xcrm.2022.100895"
  },
  "times": [
   "any"
  ],
  "signals": [
   "frustrated",
   "long_session"
  ],
  "tags": [
   "silent",
   "seated",
   "screen-free",
   "natural-breathing"
  ],
  "cautions": {
   "el": "Αν η παρατήρηση της αναπνοής σε δυσκολεύει, σταμάτα· μπορείς να δοκιμάσεις μια βόλτα ή να κοιτάξεις μακριά από την οθόνη.",
   "en": "Stop if focusing on your breath feels unpleasant; try a walk or look away from the screen instead."
  },
  "cooldownMin": 180
 },
 {
  "id": "tomorrow-starts-here",
  "title": {
   "el": "Αύριο ξεκινάς από εδώ",
   "en": "Tomorrow starts here"
  },
  "category": "shutdown",
  "durationSec": 180,
  "ui": "checklist",
  "steps": {
   "el": [
    "Πριν κλείσεις για σήμερα, σημείωσε πού σταματάς σε χαρτί ή στο δικό σου αρχείο.",
    "Πρόσθεσε ένα συγκεκριμένο επόμενο βήμα και πότε θα το κάνεις.",
    "Σε περίπου τρία λεπτά, αποθήκευσε τη δουλειά και άφησε το σημείωμα για μετά, χωρίς να σχεδιάσεις ολόκληρο το αύριο."
   ],
   "en": [
    "Before finishing for today, note where you are stopping on paper or in your own file.",
    "Add one specific next step and when you will take it.",
    "Allow about three minutes to save your work and leave the note for next time, without planning the whole day."
   ]
  },
  "claim": {
   "el": "Σε πειράματα, συγκεκριμένα σχέδια για εκκρεμότητες περιόρισαν το πόσο αυτές αποσπούσαν την προσοχή από άλλες εργασίες.",
   "en": "In experiments, making specific plans for unfinished tasks reduced how much those tasks distracted people from other work."
  },
  "level": "C",
  "source": {
   "citation": "Masicampo EJ, Baumeister RF, 2011, Journal of Personality and Social Psychology",
   "doi": "10.1037/a0024192"
  },
  "times": [
   "afternoon",
   "evening"
  ],
  "signals": [
   "long_session",
   "stuck"
  ],
  "tags": [
   "silent",
   "seated",
   "user-owned-note",
   "end-of-work"
  ],
  "cautions": {
   "el": "Για όταν τελειώνεις τη δουλειά· φύλαξε το σημείωμα σε δικό σου, εγκεκριμένο χώρο, χωρίς ευαίσθητα στοιχεία όπου δεν επιτρέπονται.",
   "en": "Choose this when finishing work; keep the note in your own approved place, without sensitive details where they are not allowed."
  },
  "cooldownMin": 360
 },
 {
  "id": "work-stays-at-the-desk",
  "title": {
   "el": "Η δουλειά μένει εδώ",
   "en": "Leave work here"
  },
  "category": "shutdown",
  "durationSec": 120,
  "ui": "checklist",
  "steps": {
   "el": [
    "Αν τελειώνεις για σήμερα και δεν χρειάζεται να παραμείνεις, αποθήκευσε τη δουλειά σου.",
    "Κλείσε το παράθυρο εργασίας και πέρασε δύο λεπτά σε άλλο δωμάτιο ή λίγο μακριά από το γραφείο.",
    "Όσα μένουν μπορούν να περιμένουν την επόμενη φορά που θα δουλέψεις."
   ],
   "en": [
    "If you are finishing for today and no longer need to stay, save your work.",
    "Close the work window and spend two minutes in another room or a little way from your desk.",
    "The remaining tasks can wait until the next time you work."
   ]
  },
  "claim": {
   "el": "Σε ανάλυση ερευνών με εργαζομένους, η αποσύνδεση από τη δουλειά συνδέθηκε με καλύτερη ξεκούραση.",
   "en": "Across studies of workers, switching off from work was associated with better recovery."
  },
  "level": "C",
  "source": {
   "citation": "Wendsche J, Lohmann-Haislah A, 2017, Frontiers in Psychology",
   "doi": "10.3389/fpsyg.2016.02072"
  },
  "times": [
   "afternoon",
   "evening"
  ],
  "signals": [
   "long_session"
  ],
  "tags": [
   "screen-free",
   "end-of-work",
   "manual-only"
  ],
  "cautions": {
   "el": "Μόνο όταν επιλέγεις να τελειώσεις και καμία ενεργή εργασία δεν απαιτεί την παρουσία σου.",
   "en": "Choose this only when you want to finish and no active task needs your presence."
  },
  "cooldownMin": 360
 },
 {
  "id": "tomorrows-thoughts-on-paper",
  "title": {
   "el": "Μια λίστα για αύριο",
   "en": "A list for tomorrow"
  },
  "category": "shutdown",
  "durationSec": 300,
  "ui": "text",
  "steps": {
   "el": [
    "Λίγο πριν τον ύπνο, αν θέλεις, πάρε ένα χαρτί και άφησε την οθόνη.",
    "Γράψε για πέντε λεπτά συγκεκριμένα πράγματα που έχεις να κάνεις τις επόμενες ημέρες, χωρίς να τα λύσεις τώρα.",
    "Άφησε το χαρτί στην άκρη, σταματώντας νωρίτερα αν η λίστα σε φορτίζει."
   ],
   "en": [
    "Just before bed, take a sheet of paper and set the screen aside if you want to try this.",
    "Spend five minutes listing specific tasks for the next few days, without trying to solve them now.",
    "Set the paper aside, stopping sooner if the list makes you feel more wound up."
   ]
  },
  "claim": {
   "el": "Σε μελέτη πριν τον ύπνο, όσοι έγραψαν μελλοντικές υποχρεώσεις για πέντε λεπτά αποκοιμήθηκαν γρηγορότερα από όσους έγραψαν ολοκληρωμένες εργασίες.",
   "en": "In a bedtime study, people who spent five minutes listing future tasks fell asleep faster than those who listed completed tasks."
  },
  "level": "B",
  "source": {
   "citation": "Scullin MK et al., 2018, Journal of Experimental Psychology: General",
   "doi": "10.1037/xge0000374"
  },
  "times": [
   "evening"
  ],
  "signals": [
   "long_session"
  ],
  "tags": [
   "screen-free",
   "user-owned-note",
   "bedtime-only",
   "manual-only"
  ],
  "cautions": {
   "el": "Μόνο αν σου ταιριάζει· δεν είναι τρόπος αντιμετώπισης προβλημάτων ύπνου, και η λίστα μένει στο χαρτί σου, χωρίς ευαίσθητα εργασιακά στοιχεία.",
   "en": "Try this only if it suits you; it does not treat sleep problems, and the list stays on your own paper without sensitive work details."
  },
  "cooldownMin": 720
 }
]
