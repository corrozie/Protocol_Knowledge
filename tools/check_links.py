"""Check local Markdown links, note reachability and Obsidian Canvas references."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
FILES = sorted(p for p in ROOT.rglob('*.md') if '.codex-source' not in p.parts and '.git' not in p.parts)
errors = []
graph = {}
links = 0
for path in FILES:
    text = path.read_text(encoding='utf-8')
    graph[path.resolve()] = set()
    for target in re.findall(r'\[[^\]\n]*\]\(([^)]+)\)', text):
        if urlsplit(target).scheme or target.startswith('#'):
            continue
        target = unquote(target.split('#', 1)[0])
        dest = (path.parent / target).resolve()
        links += 1
        if not dest.exists():
            errors.append(f'{path.relative_to(ROOT)}: missing {target}')
        elif dest.suffix == '.md':
            graph[path.resolve()].add(dest)
    if '\ufffd' in text:
        errors.append(f'{path.relative_to(ROOT)}: replacement character')

seen, todo = set(), [(ROOT / 'README.md').resolve()]
while todo:
    current = todo.pop()
    if current in seen:
        continue
    seen.add(current)
    todo.extend(graph.get(current, set()) - seen)
for path in graph.keys() - seen:
    errors.append(f'Unreachable from README: {path.relative_to(ROOT)}')

canvas = json.loads((ROOT / 'Knowledge_Map.canvas').read_text(encoding='utf-8'))
all_ids = [n['id'] for n in canvas['nodes']] + [e['id'] for e in canvas['edges']]
if len(all_ids) != len(set(all_ids)):
    errors.append('Duplicate Canvas IDs')
node_ids = {n['id'] for n in canvas['nodes']}
for node in canvas['nodes']:
    if node['type'] == 'file' and not (ROOT / node['file']).is_file():
        errors.append(f"Canvas file missing: {node['file']}")
for edge in canvas['edges']:
    if edge['fromNode'] not in node_ids or edge['toNode'] not in node_ids:
        errors.append(f"Invalid Canvas edge: {edge['id']}")

topics = [p for p in FILES if p.parent.name[:2] in {'01','02','03','04','05','06'} and p.name != 'README.md']
if len(topics) != 39:
    errors.append(f'Expected 39 topic notes, found {len(topics)}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'OK: {len(FILES)} Markdown files, {len(topics)} topics, {links} local links; all notes reachable; Canvas valid.')
