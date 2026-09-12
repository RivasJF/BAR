import { inject, Injectable } from "@angular/core";
import { Author } from "../model/author/author.model";
import { AuthorRepository } from "../model/author/autor.repository";
import { AuthorModel } from "./author.model-database";
import { AuthorMapper } from "../mapper/author.mapper";
import { DATABASE_CLIENT, DatabaseClient } from "../../../core/database/databaseClient.service";

@Injectable()
export class IAuthorRepository implements AuthorRepository {

  private respository = inject<DatabaseClient>(DATABASE_CLIENT);

  save(author: Author): Promise<Author> {
    throw new Error("Method not implemented.");
  }
  async getAllAuthors(): Promise<Author[]> {
    const authors: AuthorModel[] = await this.respository.select('SELECT * FROM autores');
    return AuthorMapper.listToEntity(authors);
  }
  async getAuthorById(id: number): Promise<Author | null> {
    const author: AuthorModel[] = await this.respository.select(`SELECT * FROM autores WHERE id_autor = ${id}`);
    if(!(author.length > 0)) {
      return null;
    }
    return AuthorMapper.toEntity(author[0]);
  }
}
