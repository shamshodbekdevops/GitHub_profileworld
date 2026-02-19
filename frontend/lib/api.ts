import { GenerateWorldResponse, WorldData } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export async function generateWorld(payload: { github_url?: string; username?: string }) {
  return request<GenerateWorldResponse>('/world/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getWorld(worldId: string) {
  return request<WorldData>(`/world/${worldId}`);
}

export async function getShareWorld(worldId: string) {
  return request<WorldData & { share_token?: string }>(`/world/${worldId}/share`);
}
