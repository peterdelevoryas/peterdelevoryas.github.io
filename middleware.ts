import { next } from '@vercel/functions';

// Gate /resume behind per-person access tokens.
//
// Tokens live in the RESUME_TOKENS env var as a comma-separated list of
// `token:label` pairs, e.g. "a1b2...:acme-recruiter,c3d4...:referral-jane".
// The label is only used for logging, so you can tell who opened the page.
//
// Mint new tokens with scripts/mint-token.sh.

export const config = {
  matcher: ['/resume', '/resume/:path*'],
};

const COOKIE = 'resume_access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Byte-identical to Zola's generated 404 page, so a blocked request is
// indistinguishable from a page that simply doesn't exist.
const NOT_FOUND = '<!doctype html>\n<title>404 Not Found</title>\n<h1>404 Not Found</h1>\n';

function parseTokens(raw: string | undefined): Map<string, string> {
  const tokens = new Map<string, string>();
  if (!raw) return tokens;
  for (const entry of raw.split(',')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const sep = trimmed.indexOf(':');
    const token = sep === -1 ? trimmed : trimmed.slice(0, sep).trim();
    const label = sep === -1 ? 'unlabeled' : trimmed.slice(sep + 1).trim();
    if (token) tokens.set(token, label || 'unlabeled');
  }
  return tokens;
}

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

function notFound(): Response {
  return new Response(NOT_FOUND, {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, noarchive',
    },
  });
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const tokens = parseTokens(process.env.RESUME_TOKENS);

  // Fail closed: an unset or empty RESUME_TOKENS must never expose the page.
  if (tokens.size === 0) {
    console.warn('[resume] RESUME_TOKENS is unset or empty - denying all access');
    return notFound();
  }

  // Arriving with a token in the link: validate it, store it in a cookie, and
  // redirect to the bare URL so the token leaves the address bar (and stops
  // leaking through the Referer header on any outbound link).
  const linkToken = url.searchParams.get('t');
  if (linkToken !== null) {
    const label = tokens.get(linkToken);
    if (label === undefined) {
      console.warn('[resume] denied: invalid token');
      return notFound();
    }
    console.log(`[resume] granted via link: ${label}`);
    const clean = new URL(url);
    clean.searchParams.delete('t');
    return new Response(null, {
      status: 302,
      headers: {
        location: clean.pathname + clean.search,
        'set-cookie': `${COOKIE}=${encodeURIComponent(linkToken)}; Path=/resume; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  // Returning visitor: the cookie carries the token.
  const cookieToken = readCookie(request.headers.get('cookie'), COOKIE);
  if (cookieToken !== undefined) {
    const label = tokens.get(decodeURIComponent(cookieToken));
    if (label !== undefined) {
      console.log(`[resume] served via cookie: ${label}`);
      return next({
        headers: {
          'cache-control': 'private, no-store',
          'x-robots-tag': 'noindex, noarchive',
        },
      });
    }
    console.warn('[resume] denied: cookie token no longer valid (revoked?)');
  }

  return notFound();
}
