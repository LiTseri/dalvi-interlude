"""Regenerates hooks/catalog.ts from spec/actions.yaml. Run: python3 build-catalog.py"""
import yaml, json
a = yaml.safe_load(open('spec/actions.yaml'))['actions']
out = []
for x in a:
    src = x['evidence']['sources'][0]
    out.append({'id': x['id'], 'title': x['title'], 'category': x['category'], 'durationSec': x['duration_sec'],
                'ui': x['ui'], 'steps': x['steps'], 'claim': x['claim'], 'level': x['evidence']['level'],
                'source': {'citation': src['citation'], 'doi': src['doi']},
                'times': x['fits']['time_of_day'], 'signals': x['fits']['signals'], 'tags': x['tags'],
                'cautions': x['cautions'], 'cooldownMin': x['cooldown_min']})
open('hooks/catalog.ts', 'w').write('// GENERATED from spec/actions.yaml by build-catalog. Do not edit by hand.\nimport type { Action } from "../types"\n\nexport const ACTIONS: Action[] = ' + json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print(len(out), 'actions')

# UI copy (card, buttons, moments, evidence labels) from spec/ui-copy.yaml
ui = yaml.safe_load(open('spec/ui-copy.yaml'))
open('hooks/copy.ts', 'w').write('// GENERATED from spec/ui-copy.yaml by build-catalog. Do not edit by hand.\n\nexport const UI_COPY = ' + json.dumps(ui, ensure_ascii=False, indent=1) + ' as const\n')
print('ui copy written')
