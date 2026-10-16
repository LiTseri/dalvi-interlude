"""Generates the mod's data files from spec/.

    spec/actions.yaml  -> hooks/catalog.ts       the 20 breaks
    spec/ui-copy.yaml  -> hooks/copy.ts          card, buttons, moments, evidence labels
    spec/signals.yaml  -> hooks/signals-data.ts  cue phrases, success phrases, mapping, AI-check consent

Run after editing anything in spec/:
    python3 build-catalog.py           write the files
    python3 build-catalog.py --check   write nothing; exit 1 if a file is out of date

Needs Python 3.8+ and PyYAML (pip install pyyaml).
"""
import json
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent


def load(name):
    with open(ROOT / 'spec' / name, encoding='utf-8') as f:
        return yaml.safe_load(f)


def ts_json(value):
    return json.dumps(value, ensure_ascii=False, indent=1)


def catalog():
    out = []
    for x in load('actions.yaml')['actions']:
        src = x['evidence']['sources'][0]
        out.append({
            'id': x['id'], 'title': x['title'], 'category': x['category'], 'durationSec': x['duration_sec'],
            'ui': x['ui'], 'steps': x['steps'], 'claim': x['claim'], 'level': x['evidence']['level'],
            'source': {'citation': src['citation'], 'doi': src['doi']},
            'times': x['fits']['time_of_day'], 'signals': x['fits']['signals'], 'tags': x['tags'],
            'cautions': x['cautions'], 'cooldownMin': x['cooldown_min'],
        })
    return ('// GENERATED from spec/actions.yaml by build-catalog.py. Do not edit by hand.\n'
            'import type { Action } from "../types"\n\n'
            f'export const ACTIONS: Action[] = {ts_json(out)}\n')


def copy():
    return ('// GENERATED from spec/ui-copy.yaml by build-catalog.py. Do not edit by hand.\n\n'
            f'export const UI_COPY = {ts_json(load("ui-copy.yaml"))} as const\n')


SIGNALS = {'stuck', 'frustrated', 'fatigued', 'long_session'}
CATEGORIES = {'breathing', 'movement', 'hydration', 'eyes', 'mind', 'shutdown'}


def signals():
    s = load('signals.yaml')
    mapping = s['mapping']
    if set(mapping) != SIGNALS:
        sys.exit(f'signals.yaml mapping: expected the signals {sorted(SIGNALS)}, got {sorted(mapping)}')
    for signal, cats in mapping.items():
        unknown = set(cats) - CATEGORIES
        if unknown:
            sys.exit(f'signals.yaml mapping.{signal}: unknown categories {sorted(unknown)}')
    cues = {k: v['el'] + v['en'] for k, v in s['cues'].items()}
    success = s['success_clears']['el'] + s['success_clears']['en']
    return ('// GENERATED from spec/signals.yaml by build-catalog.py. Do not edit by hand.\n'
            'import type { Category, Signal } from "../types"\n\n'
            f'export const CUE_PHRASES = {ts_json(cues)} as const\n\n'
            f'export const SUCCESS_PHRASES: readonly string[] = {ts_json(success)}\n\n'
            f'export const SIGNAL_MAPPING: Record<Signal, readonly Category[]> = {ts_json(mapping)}\n\n'
            f'export const AI_CONSENT = {ts_json(s["llm"]["consent_text"])} as const\n')


FILES = {
    'hooks/catalog.ts': catalog,
    'hooks/copy.ts': copy,
    'hooks/signals-data.ts': signals,
}


def main():
    check = '--check' in sys.argv[1:]
    stale = []
    for rel, make in FILES.items():
        path = ROOT / rel
        text = make()
        current = path.read_text(encoding='utf-8') if path.exists() else None
        if current == text:
            continue
        if check:
            stale.append(rel)
        else:
            path.write_text(text, encoding='utf-8')
            print('wrote', rel)
    if check:
        if stale:
            print('out of date (run python3 build-catalog.py):', ', '.join(stale))
            sys.exit(1)
        print('generated files match spec/')


if __name__ == '__main__':
    main()
