import { InjectionToken } from "@angular/core";

export interface DatabaseClient {
  execute(query: string, params?: unknown[]): any;
  loadNewDatabase(): Promise<void>;
  select<T = Record<string, unknown>>(query: string, params?: unknown[]):any;
  close(): Promise<void>;
}

export const DATABASE_CLIENT =
  new InjectionToken<DatabaseClient>('DATABASE_CLIENT');
