import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import { TEACHING_PHILOSOPHY, curriculumFor, rankModules } from './worker/curriculum.js';

const assetManifest = JSON.parse(manifestJSON);

// Workers AI text model. Swap freely — verify the current best instruct model in
// the Cloudflare dashboard. 8b is cheaper/faster; 70b is stronger for tutoring.
const AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

// ── Helpers ──────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Per-isolate cache of the design-resources catalog (no KV required).
let catalogCache = { at: 0, items: [] };
const CATALOG_TTL = 10 * 60 * 1000; // 10 min

async function getCatalog(env) {
  const now = Date.now();
  if (now - catalogCache.at < CATALOG_TTL && catalogCache.items.length) {
    return catalogCache.items;
  }
  try {
    const base = env.CATALOG_BASE || 'https://design-resources.coscient.workers.dev';
    const res = await fetch(`${base}/api/resources`, { cf: { cacheTtl: 600 } });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const data = await res.json();
    const items = (data.items || [])
      .filter((r) => r && r.title && r.url)
      .map((r) => ({ title: r.title, url: r.url, type: r.type || 'resource', tags: r.tags || [] }));
    catalogCache = { at: now, items };
    return items;
  } catch {
    return catalogCache.items; // serve stale or empty on failure
  }
}

// Cheap keyword match → up to `limit` catalog links for "further reading".
function matchCatalog(items, question, limit = 3) {
  const words = (question || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);
  if (!words.length) return [];
  const scored = items
    .map((r) => {
      const hay = `${r.title} ${(r.tags || []).join(' ')}`.toLowerCase();
      const score = words.reduce((s, w) => (hay.includes(w) ? s + 1 : s), 0);
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((x) => ({ title: x.r.title, url: x.r.url }));
}

// ── /api/ask — the Workers AI tutor ──────────────────────
async function handleAsk(request, env) {
  if (!env.AI) return json({ error: 'Workers AI binding (AI) not configured.' }, 503);

  const body = await request.json().catch(() => ({}));
  const { moduleId, question, history } = body;
  if (!question || !question.trim()) return json({ error: 'Missing question' }, 400);

  const current = curriculumFor(moduleId);
  const related = rankModules(question).filter((m) => m.id !== moduleId).slice(0, 2);

  const catalog = await getCatalog(env);
  const citations = matchCatalog(catalog, question, 3);

  const grounding = [
    current ? `CURRENT MODULE — ${current.title}\n${current.body}` : '',
    related.length
      ? `RELATED MODULES the learner may also draw on:\n${related
          .map((m) => `- ${m.title}: ${curriculumFor(m.id)?.body || ''}`)
          .join('\n')}`
      : '',
    citations.length
      ? `FURTHER READING you may cite (only these, by exact title):\n${citations
          .map((c) => `- ${c.title}`)
          .join('\n')}`
      : 'No further-reading links matched; do not fabricate citations.',
  ]
    .filter(Boolean)
    .join('\n\n');

  const messages = [
    { role: 'system', content: `${TEACHING_PHILOSOPHY}\n\n--- GROUNDING ---\n${grounding}` },
    // include a short slice of prior turns for context
    ...(Array.isArray(history) ? history.slice(-6) : []).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    })),
    { role: 'user', content: question.trim().slice(0, 2000) },
  ];

  try {
    const out = await env.AI.run(AI_MODEL, { messages, max_tokens: 700, temperature: 0.4 });
    const answer = (out && (out.response ?? out.result?.response)) || 'No answer.';
    return json({ answer: String(answer).trim(), citations });
  } catch (err) {
    return json({ error: 'AI request failed', detail: String(err) }, 502);
  }
}

// ── /api/resources — cached catalog passthrough ──────────
async function handleResources(env) {
  const items = await getCatalog(env);
  return json({ items });
}

// ── Suggestions — R2 JSON store ──────────────────────────
// Each suggestion is its own R2 object: suggestions/{iso}-{rand4}.json
// No schema, no migrations — just JSON files.

function verifyAdmin(request, env) {
  return request.headers.get('X-Admin-Key') === env.passphrase;
}

async function handleCreateSuggestion(request, env) {
  const body = await request.json().catch(() => ({}));
  const { title, url, category, note, submitter } = body;
  if (!title || !url) return json({ error: 'Missing required fields: title, url' }, 400);
  try { new URL(url); } catch { return json({ error: 'Invalid URL' }, 400); }

  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 6)}`;
  const key = `suggestions/${id}.json`;
  const payload = {
    id,
    title: title.trim(),
    url: url.trim(),
    category: category || null,
    note: note?.trim() || null,
    submitter: submitter?.trim() || null,
    status: 'pending',
    submitted_at: new Date().toISOString(),
  };

  if (!env.DATA) return json({ success: true, stored: false, note: 'R2 not bound.' }, 202);
  await env.DATA.put(key, JSON.stringify(payload), { httpMetadata: { contentType: 'application/json' } });
  return json({ success: true, stored: true, id }, 201);
}

async function handleListSuggestions(request, env) {
  if (!verifyAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
  if (!env.DATA) return json({ items: [] });
  const list = await env.DATA.list({ prefix: 'suggestions/' });
  const items = await Promise.all(
    list.objects.map(async (obj) => {
      const r = await env.DATA.get(obj.key);
      return r ? JSON.parse(await r.text()) : null;
    })
  );
  return json({ items: items.filter(Boolean).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)) });
}

async function handleDeleteSuggestion(key, request, env) {
  if (!verifyAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
  if (!env.DATA) return json({ error: 'R2 not bound' }, 503);
  await env.DATA.delete(`suggestions/${key}.json`);
  return json({ success: true });
}

async function handleUpdateSuggestion(key, request, env) {
  if (!verifyAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
  if (!env.DATA) return json({ error: 'R2 not bound' }, 503);
  const r2key = `suggestions/${key}.json`;
  const existing = await env.DATA.get(r2key);
  if (!existing) return json({ error: 'Not found' }, 404);
  const current = JSON.parse(await existing.text());
  const patch = await request.json().catch(() => ({}));
  const updated = { ...current, ...patch, id: current.id, submitted_at: current.submitted_at };
  await env.DATA.put(r2key, JSON.stringify(updated), { httpMetadata: { contentType: 'application/json' } });
  return json({ success: true, item: updated });
}

// ── Community — R2 image + JSON store ────────────────────
// Posts live at: community/{id}/meta.json + community/{id}/image

async function handleCreateCommunityPost(request, env) {
  if (!env.DATA) return json({ error: 'R2 not bound' }, 503);

  let formData;
  try { formData = await request.formData(); } catch { return json({ error: 'Expected multipart/form-data' }, 400); }

  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  if (!title || !description) return json({ error: 'Missing required fields: title, description' }, 400);

  const name = formData.get('name')?.toString().trim() || null;
  const contact = formData.get('contact')?.toString().trim() || null;
  const image = formData.get('image');

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  let imageContentType = null;
  if (image && typeof image === 'object' && image.size > 0) {
    imageContentType = image.type || 'image/jpeg';
    const buffer = await image.arrayBuffer();
    await env.DATA.put(`community/${id}/image`, buffer, { httpMetadata: { contentType: imageContentType } });
  }

  const meta = { id, title, description, name, contact, hasImage: !!imageContentType, imageContentType, submitted_at: new Date().toISOString() };
  await env.DATA.put(`community/${id}/meta.json`, JSON.stringify(meta), { httpMetadata: { contentType: 'application/json' } });

  return json({ success: true, id }, 201);
}

async function handleListCommunityPosts(env) {
  if (!env.DATA) return json({ posts: [] });
  const list = await env.DATA.list({ prefix: 'community/' });
  const metaKeys = list.objects.filter((o) => o.key.endsWith('/meta.json'));
  const posts = await Promise.all(
    metaKeys.map(async (obj) => {
      const r = await env.DATA.get(obj.key);
      return r ? JSON.parse(await r.text()) : null;
    })
  );
  return json({ posts: posts.filter(Boolean).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)) });
}

async function handleGetCommunityImage(id, env) {
  if (!env.DATA) return new Response('Not found', { status: 404 });
  const obj = await env.DATA.get(`community/${id}/image`);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(obj.body, { headers });
}

async function handleDeleteCommunityPost(id, request, env) {
  if (!verifyAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
  if (!env.DATA) return json({ error: 'R2 not bound' }, 503);
  await Promise.all([
    env.DATA.delete(`community/${id}/meta.json`),
    env.DATA.delete(`community/${id}/image`),
  ]);
  return json({ success: true });
}

// ── Entry ────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/api/')) {
      try {
        if (path === '/api/ask' && request.method === 'POST') return handleAsk(request, env);
        if (path === '/api/resources' && request.method === 'GET') return handleResources(env);
        // Suggestions — R2-backed
        if (path === '/api/suggestions' && request.method === 'POST') return handleCreateSuggestion(request, env);
        if (path === '/api/admin/suggestions' && request.method === 'GET') return handleListSuggestions(request, env);
        const suggestMatch = path.match(/^\/api\/admin\/suggestions\/([^/]+)$/);
        if (suggestMatch && request.method === 'DELETE') return handleDeleteSuggestion(suggestMatch[1], request, env);
        if (suggestMatch && request.method === 'PATCH') return handleUpdateSuggestion(suggestMatch[1], request, env);
        // Community posts
        if (path === '/api/community' && request.method === 'POST') return handleCreateCommunityPost(request, env);
        if (path === '/api/community' && request.method === 'GET') return handleListCommunityPosts(env);
        const communityImageMatch = path.match(/^\/api\/community\/([^/]+)\/image$/);
        if (communityImageMatch && request.method === 'GET') return handleGetCommunityImage(communityImageMatch[1], env);
        const communityDeleteMatch = path.match(/^\/api\/admin\/community\/([^/]+)$/);
        if (communityDeleteMatch && request.method === 'DELETE') return handleDeleteCommunityPost(communityDeleteMatch[1], request, env);
        return json({ error: 'Not found' }, 404);
      } catch (err) {
        console.error('API error:', err);
        return json({ error: 'Internal server error', detail: String(err) }, 500);
      }
    }

    // ── Static assets (SPA) ──
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest },
      );
    } catch (e) {
      if (e.status === 404) {
        try {
          return await getAssetFromKV(
            { request: new Request(`${url.origin}/index.html`, request), waitUntil: ctx.waitUntil.bind(ctx) },
            { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest },
          );
        } catch {
          return new Response('Not Found', { status: 404 });
        }
      }
      return new Response(`Internal Error: ${e.message}`, { status: 500 });
    }
  },
};
