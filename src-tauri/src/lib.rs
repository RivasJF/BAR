use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_autores_&_libros_tables",
            sql: "CREATE TABLE IF NOT EXISTS autores (
                id  INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid  TEXT NOT NULL UNIQUE CHECK (length(uuid) = 36),
                nombre TEXT NOT NULL UNIQUE CHECK (length(nombre) <= 150),
                nombre_normalizado TEXT NOT NULL CHECK (length(nombre_normalizado) <= 150)
            );

            CREATE INDEX IF NOT EXISTS idx_autores_nombre_normalizado ON autores (nombre_normalizado);


            CREATE TABLE IF NOT EXISTS libros (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid   TEXT NOT NULL UNIQUE CHECK (length(uuid) = 36), -- generado e insertado desde el código
                numero_tarjeta  INTEGER,
                signatura_topografica TEXT,
                categoria_dewey INTEGER,
                ejemplares  INTEGER NOT NULL DEFAULT 1 CHECK (ejemplares >= 1),
                volumen  INTEGER,
                titulo TEXT,
                titulo_normalizado  TEXT,
                observaciones TEXT CHECK (observaciones IS NULL OR length(observaciones) <= 250),
                fecha_registro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
            );

            CREATE INDEX IF NOT EXISTS idx_libros_titulo_normalizado
                ON libros (titulo_normalizado);
            CREATE INDEX IF NOT EXISTS idx_libros_signatura
                ON libros (signatura_topografica);
            CREATE INDEX IF NOT EXISTS idx_libros_numero_tarjeta
                ON libros (numero_tarjeta);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_autores_libros_relation",
            sql: "CREATE TABLE IF NOT EXISTS libros_autores (
                libro_id INTEGER NOT NULL,
                autor_id INTEGER NOT NULL,

                PRIMARY KEY (libro_id, autor_id),
                FOREIGN KEY (libro_id) REFERENCES libros (id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (autor_id) REFERENCES autores (id)
                    ON UPDATE CASCADE ON DELETE RESTRICT
            );

            CREATE INDEX IF NOT EXISTS idx_libros_autores_autor
                ON libros_autores (autor_id);
            CREATE INDEX IF NOT EXISTS idx_libros_autores_libro
                ON libros_autores (libro_id);",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:test.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
