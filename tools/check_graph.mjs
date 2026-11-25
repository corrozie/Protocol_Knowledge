import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {EDGES} from '../website/graph.js';
const docs=JSON.parse(await readFile(new URL('../dist/content.json',import.meta.url),'utf8'));
const keys=new Set(docs.filter(d=>d.topic).map(d=>d.id.split('/').pop()));
const covered=new Set(),pairs=new Set();
for(const [from,to,label,type] of EDGES){
 assert(keys.has(from)&&keys.has(to),`Unknown graph node: ${from} / ${to}`);
 assert.notEqual(from,to,'Self-reference');
 assert(label.trim().length>0,'Missing relationship label');
 assert(['transport','security','service','control','compare'].includes(type),'Unknown relationship type');
 assert(!pairs.has(`${from}:${to}`),`Duplicate edge ${from}:${to}`);
 pairs.add(`${from}:${to}`);covered.add(from);covered.add(to);
}
assert.equal(keys.size,39);
assert.deepEqual([...keys].sort(),[...covered].sort(),'All technologies must appear on the map');
console.log(`OK: ${keys.size} technologies, ${EDGES.length} labelled relationships, no missing or duplicate nodes.`);
