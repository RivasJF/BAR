import { inject, Injectable } from "@angular/core";
import { Author } from "../model/author/author.model";
import { AuthorRepository } from "../model/author/author.repository";
import { AuthorModel } from "../model/author/author.model-database";
import { AuthorMapper } from "../mapper/author.mapper";
import { DATABASE_CLIENT, DatabaseClient } from "../../../core/database/databaseClient.service";
import { NewAuthor } from "../model/author/newAuthor.model";
import { DomainError, PersistenceError } from "../../../core/error/domain.error";

@Injectable()
export class IAuthorRepository implements AuthorRepository {

  private respository = inject<DatabaseClient>(DATABASE_CLIENT);

  async save(author: NewAuthor): Promise<Author> {
    try {
      const query = `
          INSERT INTO autores (uuid, nombre, nombre_normalizado)
          VALUES (?, ?, ?)
          ON CONFLICT(nombre) DO UPDATE SET nombre=nombre
          RETURNING id, uuid, nombre, nombre_normalizado;
        `;

      const rows = await this.respository.select<AuthorModel>(query, [
        author.publicId,
        author.name,
        author.standardizedName
      ]);

      return AuthorMapper.toEntity(rows[0]);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudo guardar el autor.', error);
    }
  }

  async getAllAuthors(): Promise<Author[]> {
    try {
      const authors: AuthorModel[] = await this.respository.select('SELECT * FROM autores');
      return AuthorMapper.listToEntity(authors);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudieron obtener los autores.', error);
    }
  }

  async getAuthorById(id: number): Promise<Author | null> {
    try {
      const author: AuthorModel[] = await this.respository.select(`SELECT * FROM autores WHERE id = ?`, [id]);
      if (!(author.length > 0)) {
        return null;
      }
      return AuthorMapper.toEntity(author[0]);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudo obtener el autor.', error);
    }
  }

  async getAllAuthorsByName(name: string): Promise<Author[]> {
    try {
      //LIKE '%' || ? || '%' search anyway.
      const authors: AuthorModel[] = await this.respository.select(`SELECT *
           FROM autores
           WHERE nombre_normalizado LIKE ? || '%'
           ORDER BY nombre
           LIMIT 20`,
          [name]);
      if (!(authors.length > 0)) {
        return [];
      }
      return AuthorMapper.listToEntity(authors);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudieron obtener los autores.', error);
    }
  }
}
