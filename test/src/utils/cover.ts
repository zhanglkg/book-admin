/** 生成真实图书封面图（基于种子的确定性真实照片，作为最终兜底） */
export function bookCover(seed: string): string {
  const s = seed || 'book';
  return `https://picsum.photos/seed/${encodeURIComponent(s)}/200/280`;
}

/** 判断是否为占位图（需替换为真实图） */
export function isPlaceholderCover(url?: string): boolean {
  return !url || url.includes('placehold.co') || url.includes('placeholder');
}

const coverCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/** 带超时的 fetch，避免网络受限时请求永久挂起 */
function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/** 按书名从 Open Library 检索真实封面 */
async function resolveFromOpenLibrary(title: string): Promise<string | null> {
  const res = await fetchWithTimeout(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1&fields=cover_i`,
  );
  if (!res.ok) throw new Error('openlibrary request failed');
  const data = await res.json();
  const coverId = data?.docs?.[0]?.cover_i;
  if (!coverId) throw new Error('no cover');
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

/** 按书名/ISBN 从 Google Books 检索真实封面 */
async function resolveFromGoogleBooks(title: string, isbn?: string): Promise<string | null> {
  const q = isbn ? `isbn:${isbn}` : `intitle:${encodeURIComponent(title)}`;
  const res = await fetchWithTimeout(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`);
  if (!res.ok) throw new Error('google books request failed');
  const data = await res.json();
  const img =
    data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
    data?.items?.[0]?.volumeInfo?.imageLinks?.smallThumbnail;
  if (!img) throw new Error('no cover');
  return img.replace('http://', 'https://');
}

/** 按书名检索真实封面，失败回退到确定性真实照片（含并发去重） */
export async function fetchBookCover(title: string, isbn?: string): Promise<string> {
  const key = `t:${title}|i:${isbn || ''}`;
  if (coverCache.has(key)) return coverCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const task = (async () => {
    let url: string | null = null;
    try {
      url = await resolveFromOpenLibrary(title);
    } catch {
      try {
        url = await resolveFromGoogleBooks(title, isbn);
      } catch {
        url = null;
      }
    }
    const final = url || bookCover(title);
    coverCache.set(key, final);
    return final;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}
