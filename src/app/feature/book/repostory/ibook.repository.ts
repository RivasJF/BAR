import { inject, Injectable } from '@angular/core';
import { Author } from '../model/author/author.model';
import { AUTHOR_REPOSITORY, AuthorRepository } from '../model/author/author.repository';
import { Book } from '../model/book/book.model';
import { BookModel } from '../model/book/book.model.database';
import { BookRepository } from '../model/book/book.repository';
import { NewBook } from '../model/book/newBook.model';
import { DomainError, PersistenceError } from '../../../core/error/domain.error';
import { DATABASE_CLIENT, DatabaseClient } from '../../../core/database/databaseClient.service';
import { BookMapper } from '../mapper/book.mapper';
import { AuthorMapper } from '../mapper/author.mapper';

@Injectable()
export class IBookRepository implements BookRepository {

  private databaseClient = inject<DatabaseClient>(DATABASE_CLIENT);
  private authorRepository = inject<AuthorRepository>(AUTHOR_REPOSITORY);

  async save(book: NewBook): Promise<Book> {
    try {
      const authors = new Map<string, Author>();

      for (const newAuthor of book.authors) {
        const author = await this.authorRepository.save(newAuthor);
        authors.set(author.standardizedName, author);
      }

      const bookRow = await this.insertBook(book);

      for (const author of authors.values()) {
        await this.relateAuthor(bookRow.id, author.id);
      }

      return BookMapper.toEntity(bookRow, [...authors.values()]);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudo guardar el libro.', error);
    }
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      const bookModels: BookModel[] = await this.databaseClient.select('SELECT * FROM libros');

      if (bookModels.length === 0) {
        return [];
      }

      const authorsByBookId = await this.selectAuthorsGroupedByBook();
      return BookMapper.listToEntity(bookModels, authorsByBookId);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudieron obtener los libros.', error);
    }
  }

  async getBookById(id: number): Promise<Book | null> {
    try {
      const bookModels: BookModel[] = await this.databaseClient.select(
        'SELECT * FROM libros WHERE id = ?',
        [id]
      );

      if (bookModels.length === 0) {
        return null;
      }

      const authorsByBookId = await this.selectAuthorsGroupedByBook();
      return BookMapper.toEntity(bookModels[0], authorsByBookId.get(id) ?? []);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudo obtener el libro.', error);
    }
  }

  private async insertBook(book: NewBook): Promise<BookModel> {
    const rows: BookModel[] = await this.databaseClient.select(
      `INSERT INTO libros (
        uuid, numero_tarjeta, signatura_topografica, categoria_dewey,
        ejemplares, volumen, titulo, titulo_normalizado, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *;`,
      [
        book.publicId,
        book.cardNumber,
        book.callNumber,
        book.deweyCategory,
        book.copies,
        book.volume,
        book.title,
        book.titleNormalized,
        book.observations,
      ]
    );

    return rows[0];
  }

  private async relateAuthor(libroId: number, autorId: number): Promise<void> {
    await this.databaseClient.execute(
      `INSERT INTO libros_autores (libro_id, autor_id) VALUES (?, ?)
       ON CONFLICT(libro_id, autor_id) DO NOTHING;`,
      [libroId, autorId]
    );
  }

  private async selectAuthorsGroupedByBook(): Promise<Map<number, Author[]>> {
    const relations: Array<{
      libro_id: number;
      id: number;
      uuid: string;
      nombre: string;
      nombre_normalizado: string;
    }> = await this.databaseClient.select(
      `SELECT la.libro_id, a.id, a.uuid, a.nombre, a.nombre_normalizado
       FROM libros_autores la
       INNER JOIN autores a ON a.id = la.autor_id
       ORDER BY la.libro_id;`
    );

    const authorsByBookId = new Map<number, Author[]>();

    for (const row of relations) {
      const existing = authorsByBookId.get(row.libro_id) ?? [];
      existing.push(AuthorMapper.toEntity(row));
      authorsByBookId.set(row.libro_id, existing);
    }

    return authorsByBookId;
  }
}
