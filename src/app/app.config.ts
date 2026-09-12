import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { DATABASE_CLIENT } from "./core/database/databaseClient.service";
import { TauriDatabaseClient } from "./core/database/tauriDatabaseClient.service";
import { IAuthorRepository } from "./feature/book/repostory/iauthor.repository";
import { AUTHOR_REPOSITORY } from "./feature/book/model/author/autor.repository";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: DATABASE_CLIENT, useClass: TauriDatabaseClient },
    { provide: AUTHOR_REPOSITORY, useClass: IAuthorRepository }
  ]
};
