import { Author } from "../model/author/author.model";
import { Book } from "../model/book/book.model";
import { BookModel } from "../model/book/book.model.database";
import { DeweyCategory } from "../model/deweyCategory.model";

export class BookMapper {

  static toEntity(bookModel: BookModel, authors: Author[]): Book {
    const deweyCategory = bookModel.categoria_dewey as DeweyCategory;

    return Book.create(
      bookModel.id,
      bookModel.uuid,
      bookModel.numero_tarjeta ?? null,
      bookModel.signatura_topografica ?? null,
      deweyCategory,
      bookModel.ejemplares,
      bookModel.volumen ?? null,
      bookModel.titulo ?? null,
      bookModel.titulo_normalizado ?? null,
      authors,
      bookModel.observaciones ?? null,
      new Date(bookModel.fecha_registro.replace(' ', 'T'))
    );
  }

  static listToEntity(bookModels: BookModel[], authorsByBookId: Map<number, Author[]>): Book[] {
    return bookModels.map((bookModel) =>
      this.toEntity(bookModel, authorsByBookId.get(bookModel.id) ?? [])
    );
  }
}
