import { Injectable } from "@angular/core";
import { DatabaseClient } from "./databaseClient.service";
import Database, { QueryResult } from "@tauri-apps/plugin-sql";

const DB_URL: string = "sqlite:test.db";
let dbInstance: Database | null = null;
let loadingPromise: Promise<Database> | null = null;

@Injectable()
export class TauriDatabaseClient implements DatabaseClient {
  /**
   * Devuelve la instancia única de la base de datos.
   * Si ya está cargando, espera esa misma promesa (evita cargas duplicadas
   * si se llama varias veces en paralelo antes de que termine el primer load).
   */
  async getDb(): Promise<Database> {
    if (dbInstance) return dbInstance;

    if (!loadingPromise) {
      loadingPromise = Database.load(DB_URL);
    }

    dbInstance = await loadingPromise;
    return dbInstance;
  }

  /**
   * Load a new database (create new list)
   */
  async loadNewDatabase() {
    await this.getDb();
  }

  /**
   * Ejecuta INSERT / UPDATE / DELETE.
   */
  async execute(query: string, params?: unknown[]): Promise<QueryResult> {
    const db = await this.getDb();
    return db.execute(query, params);
  }

  /**
   * Ejecuta SELECT y devuelve las filas tipadas.
   */
  async select<T = Record<string, unknown>>(
    query: string,
    params?: unknown[],
  ): Promise<T[]> {
    const db = await this.getDb();
    return db.select<T[]>(query, params);
  }

  /**
   * Cierra la conexión (útil al cerrar la app o en tests).
   */
  async close(): Promise<void> {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
      loadingPromise = null;
    }
  }
}
