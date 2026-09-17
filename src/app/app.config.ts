import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { DATABASE_CLIENT } from "./core/database/databaseClient.service";
import { TauriDatabaseClient } from "./core/database/tauriDatabaseClient.service";
import { IAuthorRepository } from "./feature/book/repostory/iauthor.repository";
import { IBookRepository } from "./feature/book/repostory/ibook.repository";
import { AUTHOR_REPOSITORY } from "./feature/book/model/author/author.repository";
import { BOOK_REPOSITORY } from "./feature/book/model/book/book.repository";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: DATABASE_CLIENT, useClass: TauriDatabaseClient },
    { provide: AUTHOR_REPOSITORY, useClass: IAuthorRepository },
    { provide: BOOK_REPOSITORY, useClass: IBookRepository }
  ]
};
