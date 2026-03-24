Feature Proposal: Grammar Pack Trainer
Summary

Add a new feature type called a Grammar Pack Trainer.

A grammar pack is a small, focused lesson module built around one concept, such as:

を as the object marker
は vs が
に for destination/time
で for place of action

Each pack contains:

a small set of target sentences
optional distractors
a small number of exercise modes
lightweight local progression tracking

For your current need, the first pack would be:

Grammar Pack: を (object marker)

This feature is designed to support proven learning tactics:

active recall
generation
correction
contrast
repeated exposure over time

It avoids shallow “tap the shiny thing” interactions and instead focuses on sentence production and grammar awareness.

Goals

The feature should help the learner:

recognise the role of を in a sentence
connect objects to verbs naturally
build correct Japanese sentence patterns
notice and fix grammar mistakes
gradually internalise sentence structure through repetition

For the first pack, the learner should become comfortable with patterns like:

はんばーがーをたべます。
おんがくをききます。
こーひーをのみます。
にほんごをはなします。
まいにち だいがくで にほんごをはなします。
Scope
Included in v1

One new feature section in the app:

Grammar Packs

One pack:

を (Object Marker)

Three exercise modes:

Build
Correct
Fill

Data sourced entirely from a local JSON file.

Progress stored locally in browser storage.

Not included in v1
audio
authentication
cloud sync
free typing
spaced repetition algorithm beyond simple weighting
pack authoring UI
Why this feature fits the app

Your app already works well as:

offline-first
self-directed
lightweight
driven by your real study needs

This feature keeps that philosophy.

Instead of becoming a giant course platform, the app becomes a personal Japanese practice toolkit where each new grammar point can be added as a reusable pack.

That means every time you study something new, you can add:

a few sentences
a few exercises
a bit of metadata

And the app can immediately turn that into practice.

Exercise Modes

1. Build
Purpose

Train sentence construction and recall.

Interaction

The learner sees an English prompt and must build the Japanese sentence from tiles.

Example

Prompt:
Drink coffee

Tiles:

こーひー
を
のみます

Possible distractors:

は
たべます

Correct answer:

こーひーをのみます。
Why it matters

This is the highest-value mode because it trains generation rather than passive recognition.

1. Correct
Purpose

Train grammar awareness and error detection.

Interaction

The learner sees an incorrect Japanese sentence and must fix it.

Example

Shown:

こーひーがのみます。

Task:

Replace the wrong particle

Correct answer:

こーひーをのみます。

Other possible error types later:

wrong word order
wrong verb
extra token
missing token
Why it matters

Correction tasks strengthen understanding by forcing the learner to notice what is wrong, not just identify what looks familiar.

1. Fill
Purpose

Train focused particle recognition.

Interaction

The learner sees a sentence with a missing token and chooses the correct answer.

Example

Shown:

にほんご＿はなします。

Options:

は
を
に
で

Correct:

を
Why it matters

This is narrower than Build, but very useful for reinforcing the role of particles.

Learning Design Principles

This feature should be designed around a few simple rules.

1. Small focused packs

Each grammar pack should stay narrow. Do not mix too many concepts inside one pack.

For example:

pack 1: を
pack 2: は vs が
pack 3: に
pack 4: で
2. Build before expand

Start with short base sentences before introducing time and place expansions.

Example progression:

こーひーをのみます。
まいにち こーひーをのみます。
だいがくで にほんごをはなします。
まいにち だいがくで にほんごをはなします。
3. Prefer production over recognition

Whenever possible, the user should build or fix a sentence rather than only choose from obvious options.

1. Reuse the same core data across modes

A single sentence item should drive:

Build
Correct
Fill

This avoids duplicated content and keeps the JSON manageable.

Proposed UX Flow
Grammar Packs list

Show a simple list of available packs.

Example:

を: Object Marker
は vs が
に: Time and Destination
で: Place of Action

Each pack card can show:

title
short description
total items
progress summary
Pack screen

Show:

pack title
explanation
available modes
progress by mode

Example:
を: Object Marker
Use を to mark the direct object of a verb.

Modes:

Build
Correct
Fill
Session screen

A learner chooses one mode and runs through a small session, for example:

10 questions
mixed review weighted toward weak items
End of session

Show:

score
mistakes
items to review again
JSON File Proposal

The data should be stored in a local JSON file and be generic enough to support future grammar packs.

I recommend a structure like this:

{
  "version": 1,
  "packs": [
    {
      "id": "object-marker-wo",
      "title": "を",
      "subtitle": "Object Marker",
      "description": "Use を to mark the direct object of a verb.",
      "tags": ["particle", "beginner", "grammar"],
      "supportedModes": ["build", "correct", "fill"],
      "items": [
        {
          "id": "burger-eat",
          "english": "Eat a hamburger",
          "japanese": "はんばーがーをたべます。",
          "tokens": ["はんばーがー", "を", "たべます"],
          "translationNotes": [],
          "focus": {
            "grammarPoint": "を",
            "role": "object-marker"
          },
          "build": {
            "distractors": ["は", "のみます", "こーひー"]
          },
          "correct": {
            "incorrectJapanese": "はんばーがーがたべます。",
            "errorType": "wrong-particle"
          },
          "fill": {
            "promptJapanese": "はんばーがー＿たべます。",
            "answer": "を",
            "options": ["は", "が", "を", "に"]
          }
        },
        {
          "id": "music-listen",
          "english": "Listen to music",
          "japanese": "おんがくをききます。",
          "tokens": ["おんがく", "を", "ききます"],
          "translationNotes": [],
          "focus": {
            "grammarPoint": "を",
            "role": "object-marker"
          },
          "build": {
            "distractors": ["は", "のみます", "こーひー"]
          },
          "correct": {
            "incorrectJapanese": "おんがくがききます。",
            "errorType": "wrong-particle"
          },
          "fill": {
            "promptJapanese": "おんがく＿ききます。",
            "answer": "を",
            "options": ["は", "が", "を", "で"]
          }
        },
        {
          "id": "coffee-drink",
          "english": "Drink coffee",
          "japanese": "こーひーをのみます。",
          "tokens": ["こーひー", "を", "のみます"],
          "translationNotes": [],
          "focus": {
            "grammarPoint": "を",
            "role": "object-marker"
          },
          "build": {
            "distractors": ["は", "たべます", "おんがく"]
          },
          "correct": {
            "incorrectJapanese": "こーひーがのみます。",
            "errorType": "wrong-particle"
          },
          "fill": {
            "promptJapanese": "こーひー＿のみます。",
            "answer": "を",
            "options": ["は", "を", "に", "で"]
          }
        },
        {
          "id": "japanese-speak",
          "english": "Speak Japanese",
          "japanese": "にほんごをはなします。",
          "tokens": ["にほんご", "を", "はなします"],
          "translationNotes": [],
          "focus": {
            "grammarPoint": "を",
            "role": "object-marker"
          },
          "build": {
            "distractors": ["は", "ききます", "おんがく"]
          },
          "correct": {
            "incorrectJapanese": "にほんごがはなします。",
            "errorType": "wrong-particle"
          },
          "fill": {
            "promptJapanese": "にほんご＿はなします。",
            "answer": "を",
            "options": ["は", "が", "を", "に"]
          }
        },
        {
          "id": "daily-university-speak-japanese",
          "english": "Every day, I speak Japanese at university",
          "japanese": "まいにち だいがくで にほんごをはなします。",
          "tokens": ["まいにち", "だいがくで", "にほんご", "を", "はなします"],
          "translationNotes": [
            "だいがくで indicates the place where the action happens."
          ],
          "focus": {
            "grammarPoint": "を",
            "role": "object-marker"
          },
          "build": {
            "distractors": ["は", "に", "たべます"]
          },
          "correct": {
            "incorrectJapanese": "まいにち だいがくで にほんごがはなします。",
            "errorType": "wrong-particle"
          },
          "fill": {
            "promptJapanese": "まいにち だいがくで にほんご＿はなします。",
            "answer": "を",
            "options": ["は", "が", "を", "で"]
          }
        }
      ]
    }
  ]
}
Format Design Notes
Top level
version

Allows you to evolve the schema later.

packs

An array of grammar packs.

This makes the system expandable and avoids separate one-off JSON formats per feature.

Pack object
id

Stable identifier for routing and local progress storage.

title

Short Japanese label.

subtitle

Readable English label.

description

Short explanation shown on the pack screen.

tags

Useful for filtering later if you want categories like:

particle
verb
adjective
sentence-pattern
supportedModes

Lets the UI know which modes to enable.

items

The practice content.

Item object

Each item represents one core sentence.

id

Stable per-item identifier.

english

Main learner-facing prompt.

japanese

The canonical correct sentence.

tokens

Tokenised form used by Build mode.

This should be pre-tokenised in the JSON so the app does not need to guess how to split the sentence.

translationNotes

Optional supporting notes.

focus

Metadata about the grammar point.

build

Mode-specific configuration for Build mode.

correct

Mode-specific configuration for Correct mode.

fill

Mode-specific configuration for Fill mode.

Why mode-specific config is useful

You could try to generate everything automatically from the canonical sentence, but that gets messy fast.

For example:

distractors are better curated manually
wrong answers should be intentional, not random
fill options should be educational, not arbitrary

So I recommend:

keep the base sentence canonical
define per-mode data explicitly where needed

This keeps the learning quality high.

Recommended TypeScript Types

Here is a matching type definition you can use in your React/Vite app.

export type GrammarDataFile = {
  version: number;
  packs: GrammarPack[];
};

export type GrammarPack = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  supportedModes: GrammarMode[];
  items: GrammarItem[];
};

export type GrammarMode = "build" | "correct" | "fill";

export type GrammarItem = {
  id: string;
  english: string;
  japanese: string;
  tokens: string[];
  translationNotes: string[];
  focus: {
    grammarPoint: string;
    role: string;
  };
  build?: {
    distractors: string[];
  };
  correct?: {
    incorrectJapanese: string;
    errorType: "wrong-particle" | "wrong-order" | "wrong-verb" | "missing-token";
  };
  fill?: {
    promptJapanese: string;
    answer: string;
    options: string[];
  };
};
Local Progress Storage Proposal

Since there is no auth, store progress in local storage keyed by pack and mode.

Example shape:

{
  "grammarProgress": {
    "object-marker-wo": {
      "build": {
        "burger-eat": { "seen": 4, "correct": 3, "streak": 2 },
        "coffee-drink": { "seen": 2, "correct": 1, "streak": 0 }
      },
      "correct": {
        "burger-eat": { "seen": 1, "correct": 1, "streak": 1 }
      },
      "fill": {
        "japanese-speak": { "seen": 5, "correct": 5, "streak": 5 }
      }
    }
  }
}

This is enough for lightweight weighting such as:

prioritise unseen items
then weak items
then random mastered items occasionally
Suggested Implementation Order
Phase 1
add JSON file
add pack list page
add pack detail page
implement Fill mode
Phase 2
implement Build mode
Phase 3
implement Correct mode
Phase 4
add local progress weighting

This keeps the first usable version small and lets you validate the feature quickly.

Recommended v1 Constraints

To avoid overengineering, I would keep these rules in place:

no kana/kanji toggling in v1
one accepted answer per item
one incorrect sentence per correction item
one gap per fill item
fixed token order for correct answer
manual distractors only

That gives you something robust enough to grow from.

Future Extensions

The proposed format leaves room for future modes like:

contrast
Compare two similar sentences and choose which matches the meaning.
reorder
Same as Build but without an English prompt.
expand
Start from a base sentence and add time/place information.
typed-answer
Accept full typed answers later if you decide the friction is worth it.
Recommendation

I recommend you build this as a reusable Grammar Pack system, not as a single one-off “practice を” mini-game.

That gives you:

a stable JSON-driven content system
a reusable UI structure
low-friction addition of future grammar concepts
a more coherent learning model inside the app

For your current needs, the first release should be:

one pack: を
three modes: Build, Correct, Fill
local JSON content
local progress only

That is small, useful, and aligned with actual learning rather than dopamine loops.
