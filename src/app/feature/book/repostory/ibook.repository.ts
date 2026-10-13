import { inject, Injectable } from '@angular/core';
import { Author } from '../model/author/author.model';
import { AUTHOR_REPOSITORY, AuthorRepository } from '../model/author/author.repository';
import { Book } from '../model/book/book.model';
import { BookModel } from '../model/book/book.model.database';
import {
  AdvancedBookSearch,
  BookRepository,
  BookSearchField,
} from '../model/book/book.repository';
import { NewBook } from '../model/book/newBook.model';
import { NewAuthor } from '../model/author/newAuthor.model';
import { DomainError, PersistenceError } from '../../../core/error/domain.error';
import { DATABASE_CLIENT, DatabaseClient } from '../../../core/database/databaseClient.service';
import { BookMapper } from '../mapper/book.mapper';
import { AuthorMapper } from '../mapper/author.mapper';

@Injectable()
export class IBookRepository implements BookRepository {

  private databaseClient = inject<DatabaseClient>(DATABASE_CLIENT);
  private authorRepository = inject<AuthorRepository>(AUTHOR_REPOSITORY);

  async save(book: NewBook | Book): Promise<Book> {
    try {
      if (book instanceof Book) {
        return await this.updateBook(book);
      }

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

  private async updateBook(book: Book): Promise<Book> {
    const authors = new Map<string, Author>();

    for (const currentAuthor of book.authors ?? []) {
      const author = await this.authorRepository.save(NewAuthor.create(currentAuthor.name));
      authors.set(author.standardizedName, author);
    }

    const rows: BookModel[] = await this.databaseClient.select(
      `UPDATE libros SET
        numero_tarjeta = ?,
        signatura_topografica = ?,
        categoria_dewey = ?,
        ejemplares = ?,
        volumen = ?,
        titulo = ?,
        titulo_normalizado = ?,
        observaciones = ?
       WHERE id = ?
       RETURNING *;`,
      [
        book.cardNumber,
        book.callNumber,
        book.deweyCategory,
        book.copies,
        book.volume,
        book.title,
        book.titleNormalized,
        book.observations,
        book.id,
      ]
    );

    if (rows.length === 0) {
      throw new DomainError('No se encontró el libro que se desea editar.');
    }

    await this.databaseClient.execute(
      'DELETE FROM libros_autores WHERE libro_id = ?;',
      [book.id]
    );

    for (const author of authors.values()) {
      await this.relateAuthor(book.id, author.id);
    }

    return BookMapper.toEntity(rows[0], [...authors.values()]);
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

  async searchBooks(field: BookSearchField, value: string): Promise<Book[]> {
        const columns: Record<BookSearchField, string> = {
          title: 'b.titulo_normalizado',
          author: 'a.nombre_normalizado',
          callNumber: 'b.signatura_topografica',
          cardNumber: 'CAST(b.numero_tarjeta AS TEXT)',
        };

        const column = columns[field];
        const normalizedValue = value.trim().toLocaleLowerCase();
        const query = field === 'author'
          ? `SELECT DISTINCT b.* FROM libros b
             INNER JOIN libros_autores la ON la.libro_id = b.id
             INNER JOIN autores a ON a.id = la.autor_id
             WHERE ${column} LIKE ?
             ORDER BY b.id;`
          : `SELECT b.* FROM libros b
             WHERE ${column} LIKE ?
             ORDER BY b.id;`;

        return this.getBooksByQuery(query, [`%${normalizedValue}%`]);
      }

  async advancedSearchBooks(criteria: AdvancedBookSearch): Promise<Book[]> {
        const conditions: string[] = [];
        const parameters: string[] = [];

        if (criteria.cardNumber?.trim()) {
          conditions.push('CAST(b.numero_tarjeta AS TEXT) LIKE ?');
          parameters.push(`%${criteria.cardNumber.trim()}%`);
        }
        if (criteria.title?.trim()) {
          conditions.push('b.titulo_normalizado LIKE ?');
          parameters.push(`%${criteria.title.trim().toLocaleLowerCase()}%`);
        }
        if (criteria.callNumber?.trim()) {
          conditions.push('b.signatura_topografica LIKE ?');
          parameters.push(`%${criteria.callNumber.trim()}%`);
        }
        if (criteria.deweyCategory?.trim()) {
          conditions.push('CAST(b.categoria_dewey AS TEXT) LIKE ?');
          parameters.push(`%${criteria.deweyCategory.trim()}%`);
        }

        const author = criteria.author?.trim();
        if (author) {
          conditions.push(`EXISTS (
            SELECT 1 FROM libros_autores la
            INNER JOIN autores a ON a.id = la.autor_id
            WHERE la.libro_id = b.id AND a.nombre_normalizado LIKE ?
          )`);
          parameters.push(`%${author.toLocaleLowerCase()}%`);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        return this.getBooksByQuery(
          `SELECT b.* FROM libros b ${where} ORDER BY b.id;`,
          parameters,
        );
      }

  async delete(book: Book): Promise<void> {
    try {
      await this.databaseClient.execute(
        'DELETE FROM libros_autores WHERE libro_id = ?;',
        [book.id]
      );

      const deletedRows: Array<{ id: number }> = await this.databaseClient.select(
        'DELETE FROM libros WHERE id = ? RETURNING id;',
        [book.id]
      );

      if (deletedRows.length === 0) {
        throw new DomainError('No se encontró el libro que se desea eliminar.');
      }
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new PersistenceError('No se pudo eliminar el libro.', error);
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

  private async getBooksByQuery(
      query: string,
      parameters: string[],
    ): Promise<Book[]> {
      try {
        const bookModels: BookModel[] = await this.databaseClient.select(query, parameters);
        const authorsByBookId = await this.selectAuthorsGroupedByBook();
        return BookMapper.listToEntity(bookModels, authorsByBookId);
      } catch (error) {
        if (error instanceof DomainError) throw error;
        throw new PersistenceError('No se pudieron buscar los libros.', error);
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
