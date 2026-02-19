export type GenerationStatus = 'processing' | 'ready' | 'failed';

export interface RepoSnapshot {
  repo_id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  primary_language: string;
  language_breakdown: Record<string, number>;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  size_kb: number;
  commits_30d: number;
  activity_score: number;
  last_activity_at: string | null;
  is_fork: boolean;
  pos_x: number;
  pos_y: number;
  pos_z: number;
}

export interface LanguageStat {
  language: string;
  percent: number;
  color_token: string;
}

export interface RenderConfig {
  seed: number;
  layout_version: string;
  density_level: number;
  lighting_profile: string;
  enable_particles: boolean;
}

export interface WorldData {
  id: string;
  username: string;
  github_url: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  totals: {
    total_stars: number;
    total_forks: number;
    total_watchers: number;
    repo_count: number;
  };
  generation_status: GenerationStatus;
  generated_at: string;
  updated_at: string;
  expires_at: string;
  repos: RepoSnapshot[];
  languages: LanguageStat[];
  render_config: RenderConfig;
}

export interface GenerateWorldResponse {
  world_id: string;
  status: GenerationStatus;
  cached: boolean;
  stale?: boolean;
  rate_limited_until?: string;
  eta_seconds: number;
}
