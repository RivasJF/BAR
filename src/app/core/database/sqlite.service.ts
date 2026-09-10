import Database from '@tauri-apps/plugin-sql';

const DB_URL:string='sqlite:test.db'

let dbInstance: Database | null = null;
let loadingPromise: Promise<Database> | null = null;

/**
 * Devuelve la instancia única de la base de datos.
 * Si ya está cargando, espera esa misma promesa (evita cargas duplicadas
 * si se llama varias veces en paralelo antes de que termine el primer load).
 */
async function getDb(): Promise<Database> {
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
export async function loadNewDatabase() {
  await getDb();
}

/**
 * Ejecuta INSERT / UPDATE / DELETE.
 */
export async function execute(query: string, params: unknown[] = []) {
  const db = await getDb();
  return db.execute(query, params);
}

/**
 * Ejecuta SELECT y devuelve las filas tipadas.
 */
export async function select<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const db = await getDb();
  return db.select<T[]>(query, params);
}

/**
 * Cierra la conexión (útil al cerrar la app o en tests).
 */
export async function closeDb() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    loadingPromise = null;
  }
}
