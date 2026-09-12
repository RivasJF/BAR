import { InjectionToken } from "@angular/core";
import { Author } from "./author.model";

export interface AuthorRepository {
  save(author: Author): Promise<Author>;
  getAllAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | null>;
}

export const AUTHOR_REPOSITORY = new InjectionToken<AuthorRepository>('AuthorRepository');
