import { InjectionToken } from "@angular/core";
import { Author } from "./author.model";
import { NewAuthor } from "./newAuthor.model";

export interface AuthorRepository {
  save(author: NewAuthor): Promise<Author>;
  getAllAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | null>;
  getAllAuthorsByName(name: string): Promise<Author[]>;
}

export const AUTHOR_REPOSITORY = new InjectionToken<AuthorRepository>('AuthorRepository');
