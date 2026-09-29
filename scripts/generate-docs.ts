import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..')
const ERP_DIR = join(ROOT, 'src', 'erp')
const RESOURCES_DIR = join(ERP_DIR, 'resources')
const SDK_GEN = join(ROOT, 'src', 'generated', 'sdk.gen.ts')
const OUT_FILE = join(ROOT, 'docs', 'erp-client.html')

interface SdkEndpoint {
	method: string
	url: string
}

interface ResourceMethod {
	name: string
	signature: string
	doc: string
	sdkFn: string | null
}

interface Resource {
	factory: string
	property: string
	doc: string
	file: string
	methods: ResourceMethod[]
}

function cleanDoc(raw: string): string {
	return raw
		.split('\n')
		.map((l) => l.replace(/^\s*\*\s?/, '').trimEnd())
		.join('\n')
		.trim()
		.replace(/^\n+|\n+$/g, '')
}

function parseSdkEndpoints(): Map<string, SdkEndpoint> {
	const src = readFileSync(SDK_GEN, 'utf8')
	const map = new Map<string, SdkEndpoint>()
	// export const <name> = ... (options.client ?? client).<method><...>({
	//   url: '<url>',
	const re =
		/export const (\w+)\s*=[\s\S]*?\(options(?:\?\.client|\.client) ??\?{0,1}.*?\)\.(get|post|put|delete|patch|head|options)<[\s\S]*?url:\s*'([^']+)'/g
	for (const m of src.matchAll(re)) {
		map.set(m[1], { method: m[2].toUpperCase(), url: m[3] })
	}
	return map
}

function parseResourceFile(file: string): Resource[] {
	const src = readFileSync(join(RESOURCES_DIR, file), 'utf8')
	// One file may export multiple factories (e.g. categories.ts exports
	// createCategoriesResource + createCompanyTypesResource).
	const factoryStarts: { factory: string; index: number; doc: string }[] = []
	const factoryRe = /\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*export function (\w+)\(client: Client\)/g
	for (const fm of src.matchAll(factoryRe)) {
		const index = fm.index ?? 0
		factoryStarts.push({ factory: fm[2], index, doc: cleanDoc(fm[1]) })
	}
	if (factoryStarts.length === 0) {
		return []
	}
	return factoryStarts.map((f, i) => {
		const span = src.slice(f.index, factoryStarts[i + 1]?.index ?? src.length)
		// Nested sub-objects like `prices: { ... }` (2-tab indent, closed by `\n\t\t},`).
		const nestedBlocks: { prefix: string; start: number; end: number }[] = []
		const nestedRe = /\n(\t\t)(\w+):\s*\{\n/g
		for (const nm of span.matchAll(nestedRe)) {
			const nmIndex = nm.index ?? 0
			const closeIdx = span.indexOf('\n\t\t},', nmIndex)
			if (closeIdx !== -1) {
				nestedBlocks.push({ prefix: nm[2], start: nmIndex, end: closeIdx })
			}
		}
		const methods: ResourceMethod[] = []
		// Tempered doc content (cannot cross `*/`) so a factory-level JSDoc
		// never merges into the first method's doc.
		const re =
			/\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*async (\w+)\(([\s\S]*?)\)(?::\s*Promise<([^>]+)>)?\s*\{/g
		for (const m of span.matchAll(re)) {
			const mIndex = m.index ?? 0
			const [, rawDoc, name, rawParams, rawRet] = m
			const params = rawParams
				.replace(/\s+/g, ' ')
				.replace(/,(\s*\))/g, '$1')
				.replace(/,\s*$/, '')
				.trim()
			const ret = (rawRet ?? 'unknown').replace(/\s+/g, ' ').trim()
			const methodStart = mIndex
			// Method body: a simple brace scan from the opening `{` is deterministic.
			const bodyOpen = mIndex + m[0].length - 1
			let depth = 0
			let bodyEnd = span.length
			for (let j = bodyOpen; j < span.length; j++) {
				if (span[j] === '{') {
					depth++
				} else if (span[j] === '}') {
					depth--
					if (depth === 0) {
						bodyEnd = j
						break
					}
				}
			}
			const body = span.slice(bodyOpen, bodyEnd)
			const sdkCall = body.match(/await (\w+)\(/)
			const sdkFn = sdkCall ? sdkCall[1] : null
			const nested = nestedBlocks.find((b) => methodStart > b.start && methodStart < b.end)
			const fullName = nested ? `${nested.prefix}.${name}` : name
			const signature = `${fullName}(${params}): Promise<${ret}>`
			methods.push({ name: fullName, signature, doc: cleanDoc(rawDoc), sdkFn })
		}
		return {
			factory: f.factory,
			property: PROPERTY_BY_FACTORY[f.factory] ?? f.factory,
			doc: f.doc,
			file: `src/erp/resources/${file}`,
			methods,
		}
	})
}

function parseClientOptions(): string {
	const src = readFileSync(join(ERP_DIR, 'client.ts'), 'utf8')
	const match = src.match(/export interface CreateErpClientOptions \{([\s\S]*?)\n\}/)
	if (!match) {
		return ''
	}
	return match[1]
		.split('\n')
		.map((l) => l.trimEnd())
		.join('\n')
		.trim()
}

const PROPERTY_BY_FACTORY: Record<string, string> = {
	createAccountingTypesResource: 'accountingTypes',
	createCatalogResource: 'catalog',
	createCategoriesResource: 'categories',
	createCompanyTypesResource: 'types',
	createChecklistsResource: 'checklists',
	createCompaniesResource: 'companies',
	createCustomersResource: 'customers',
	createDepartmentsResource: 'departments',
	createEmployeesResource: 'employees',
	createOffersResource: 'offers',
	createTicketsResource: 'tickets',
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

function renderDoc(doc: string): string {
	return doc
		.split(/\n\s*\n/)
		.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
		.join('\n')
}

const METHOD_CLASS: Record<string, string> = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'del',
	PATCH: 'patch',
}

function main(): void {
	const endpoints = parseSdkEndpoints()
	const files = readdirSync(RESOURCES_DIR)
		.filter((f) => f.endsWith('.ts'))
		.sort()
	const resources: Resource[] = files.flatMap((file) => parseResourceFile(file))
	const totalMethods = resources.reduce((n, r) => n + r.methods.length, 0)
	const optionsBlock = parseClientOptions()

	const nav = resources
		.map(
			(r) =>
				`<a class="nav-link" href="#erp-${r.property}" data-target="erp-${r.property}"><code>erp.${r.property}</code><span>${r.methods.length}</span></a>`,
		)
		.join('\n')

	const sections = resources
		.map((r) => {
			const cards = r.methods
				.map((m) => {
					const ep = m.sdkFn ? endpoints.get(m.sdkFn) : undefined
					const methodClass = ep ? (METHOD_CLASS[ep.method] ?? 'other') : 'other'
					const search =
						`erp.${r.property}.${m.signature} ${m.doc} ${m.sdkFn ?? ''} ${ep ? `${ep.method} ${ep.url}` : ''}`
							.toLowerCase()
							.replace(/"/g, '')
					const endpoint = ep
						? `<span class="ep"><span class="badge ${methodClass}">${ep.method}</span><code>${escapeHtml(ep.url)}</code></span>`
						: ''
					const sdk = m.sdkFn
						? `<span class="sdk">SDK: <code>${m.sdkFn}</code></span>`
						: ''
					const fullSig = `erp.${r.property}.${m.signature}`
					return `<article class="method" data-search="${escapeHtml(search)}">
<h4><code>${escapeHtml(fullSig)}</code></h4>
${m.doc ? renderDoc(m.doc) : ''}
<div class="meta">${endpoint}${sdk}</div>
</article>`
				})
				.join('\n')
			return `<details class="resource" id="erp-${r.property}" open>
<summary><code>erp.${r.property}</code><span class="count">${r.methods.length} methods</span><span class="src">${r.file}</span></summary>
${r.doc ? renderDoc(r.doc) : ''}
${cards}
</details>`
		})
		.join('\n')

	const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ERP client (createErpClient) — API reference</title>
<style>
:root { color-scheme: light dark; --bg: #fff; --fg: #1a1a1a; --muted: #666; --card: #f6f6f4; --border: #ddd; --accent: #0b5fff; }
@media (prefers-color-scheme: dark) { :root { --bg: #141414; --fg: #e8e8e8; --muted: #aaa; --card: #1e1e1e; --border: #333; --accent: #7aa5ff; } }
* { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); margin: 0; line-height: 1.5; }
header.top { position: sticky; top: 0; background: var(--bg); border-bottom: 1px solid var(--border); padding: 1rem; z-index: 10; }
header.top h1 { margin: 0 0 0.25rem; font-size: 1.4rem; }
header.top p.sub { margin: 0 0 0.75rem; color: var(--muted); }
.controls { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.controls input[type="search"] { flex: 1; min-width: 200px; padding: 0.5rem; font-size: 1rem; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--fg); }
.controls button { padding: 0.5rem 0.75rem; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card); color: var(--fg); }
.controls #count { color: var(--muted); font-size: 0.9rem; }
.layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); align-items: start; }
aside.sidebar { position: sticky; top: var(--top, 170px); max-height: calc(100vh - var(--top, 170px)); overflow-y: auto; border-right: 1px solid var(--border); padding: 1rem 0.75rem 2rem 1rem; }
aside.sidebar nav { display: flex; flex-direction: column; gap: 0.15rem; }
.side-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0.75rem 0 0.25rem; }
.side-label:first-child { margin-top: 0; }
.nav-link { display: flex; justify-content: space-between; gap: 0.5rem; text-decoration: none; color: var(--fg); padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.9rem; }
.nav-link:hover { background: var(--card); }
.nav-link.active { background: var(--card); outline: 1px solid var(--accent); }
.nav-link span { color: var(--muted); }
main { padding: 1rem; max-width: 960px; min-width: 0; }
main h2, details.resource { scroll-margin-top: calc(var(--top, 170px) + 12px); }
@media (max-width: 860px) {
  .layout { display: block; }
  aside.sidebar { position: static; max-height: none; border-right: none; border-bottom: 1px solid var(--border); padding: 0.75rem 1rem; }
  aside.sidebar nav { flex-direction: row; overflow-x: auto; gap: 0.4rem; align-items: center; }
  .side-label { display: none; }
  .nav-link { white-space: nowrap; border: 1px solid var(--border); }
}
pre { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; overflow-x: auto; }
details.resource { border: 1px solid var(--border); border-radius: 8px; margin: 1rem 0; padding: 0 1rem 1rem; }
details.resource summary { cursor: pointer; padding: 0.75rem 0; font-size: 1.1rem; }
details.resource summary .count { color: var(--muted); margin-left: 0.5rem; font-size: 0.9rem; }
details.resource summary .src { display: block; font-size: 0.8rem; color: var(--muted); }
article.method { border-top: 1px solid var(--border); padding: 0.75rem 0; }
article.method h4 { margin: 0 0 0.4rem; display: flex; gap: 0.5rem; align-items: baseline; flex-wrap: wrap; }
article.method h4 code { overflow-wrap: anywhere; }
.meta { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; font-size: 0.85rem; color: var(--muted); margin-top: 0.4rem; }
.badge { font-weight: 700; font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 4px; color: #fff; }
.badge.get { background: #2a7f3f; } .badge.post { background: #0b5fff; } .badge.put { background: #b26a00; }
.badge.del { background: #c0392b; } .badge.patch { background: #6c3483; } .badge.other { background: #666; }
#empty { padding: 2rem 1rem; color: var(--muted); }
footer { padding: 1rem; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); }
code { font-family: ui-monospace, monospace; }
</style>
</head>
<body>
<header class="top">
<h1>ERP client (<code>createErpClient</code>)</h1>
<p class="sub">${resources.length} resources, ${totalMethods} methods. All methods return the success body directly and throw <code>ErpApiError</code> on non-2xx. Regenerate with <code>bun run docs</code>.</p>
<div class="controls">
<input id="q" type="search" placeholder="Filter methods, e.g. companies, upload, POST /api/erp/v1/..." autocomplete="off">
<button type="button" id="expand">Expand all</button>
<button type="button" id="collapse">Collapse all</button>
<span id="count" aria-live="polite"></span>
</div>
</header>
<div class="layout">
<aside class="sidebar"><nav aria-label="Page navigation">
<div class="side-label">Guide</div>
<a class="nav-link" href="#usage" data-target="usage">Usage</a>
<a class="nav-link" href="#options" data-target="options">createErpClient(options)</a>
<a class="nav-link" href="#errors" data-target="errors">ErpApiError</a>
<div class="side-label">Resources</div>
${nav}</nav></aside>
<main>
<h2 id="usage">Usage</h2>
<pre><code>import { createErpClient } from 'tanss-api'

const erp = createErpClient({
  baseUrl: 'https://tanss.example.com',
  token: process.env.TANSS_ERP_TOKEN!, // ERP/CENTRON/SYSTEMHAUS_ONE role, incl. Bearer prefix
})

const company = await erp.companies.get(42)
erp.setToken(nextToken) // rotate without rebuilding</code></pre>
<h2 id="options">createErpClient(options)</h2>
<p>Isolated hey-api instance (no shared <code>client</code> singleton, so user tokens cannot leak into ERP requests).</p>
<pre><code>interface CreateErpClientOptions {
${escapeHtml(optionsBlock)}
}</code></pre>
<h2 id="errors">ErpApiError</h2>
<p>Thrown on any non-2xx response. Fields: <code>message</code>, <code>status?</code>, <code>body</code>, <code>request?</code>, <code>response?</code>. Catch with <code>error instanceof ErpApiError</code>.</p>
<p><strong>Note:</strong> <code>erp.offers</code> (<code>/api/v1/offers/erpSelections*</code>) uses a normal user session token, not the ERP-role token.</p>
<h2 id="resources">Resources</h2>
${sections}
<p id="empty" hidden>No methods match the current filter.</p>
</main>
</div>
<footer>DO NOT EDIT — generated by <code>bun run docs</code>. Edit JSDoc in <code>src/erp/**/*.ts</code> instead. Raw generated SDK (<code>src/generated/sdk.gen.ts</code>, 850+ functions) is documented via JSDoc/OpenAPI, not here.</footer>
<script>
const q = document.getElementById('q');
const methods = Array.from(document.querySelectorAll('.method'));
const sections = Array.from(document.querySelectorAll('details.resource'));
const empty = document.getElementById('empty');
const count = document.getElementById('count');
function apply() {
  const needle = q.value.trim().toLowerCase();
  let visible = 0;
  for (const m of methods) {
    const hay = m.getAttribute('data-search') || '';
    const hit = !needle || hay.includes(needle);
    m.hidden = !hit;
    if (hit) visible++;
  }
  for (const s of sections) {
    const cards = Array.from(s.querySelectorAll('.method'));
    const any = cards.some((m) => !m.hidden);
    s.hidden = !any;
    if (needle && any) s.open = true;
  }
  count.textContent = visible + ' of ' + methods.length + ' methods';
  empty.hidden = visible !== 0;
}
q.addEventListener('input', apply);
apply();
function setTop() {
  const h = document.querySelector('header.top');
  if (h) document.documentElement.style.setProperty('--top', h.offsetHeight + 8 + 'px');
}
setTop();
window.addEventListener('resize', setTop);
const links = Array.from(document.querySelectorAll('.nav-link'));
const targets = links
  .map((a) => document.getElementById(a.getAttribute('data-target') || ''))
  .filter((el) => el);
function spy() {
  const top = (document.querySelector('header.top') || { offsetHeight: 170 }).offsetHeight + 24;
  let current = '';
  for (const el of targets) {
    if (el.getBoundingClientRect().top <= top) current = el.id;
  }
  for (const a of links) {
    const on = a.getAttribute('data-target') === current;
    if (on) a.classList.add('active');
    else a.classList.remove('active');
  }
}
document.addEventListener('scroll', spy, { passive: true });
spy();
document.getElementById('expand').addEventListener('click', () => {
  for (const s of sections) {
    if (!s.hidden) s.open = true;
  }
});
document.getElementById('collapse').addEventListener('click', () => {
  for (const s of sections) s.open = false;
});
</script>
</body>
</html>
`
	mkdirSync(join(ROOT, 'docs'), { recursive: true })
	writeFileSync(OUT_FILE, `${html.trimEnd()}\n`)
	console.log(`Wrote ${OUT_FILE}: ${resources.length} resources, ${totalMethods} methods`)
}

main()
