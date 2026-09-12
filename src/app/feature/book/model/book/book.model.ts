import { Author } from "../author/author.model";

export class Book {

  private constructor(
    public readonly id: string,
    public readonly publicId: string,
    public readonly cardNumber: number | null,
    public readonly callNumber: string | null,
    public readonly deweyCategory: DeweyCategory,
    public readonly copies: number,
    public readonly volume: number | null,
    public readonly title: string | null,
    public readonly titleNormalized: string | null,
    public readonly authors: Author[] | null,
    public readonly observations: string | null,
    public readonly createdAt: Date,
  ) { }

  static create(
    id: string,
    publicId: string,
    cardNumber: number,
    callNumber: string,
    deweyCategory: DeweyCategory,
    copies: number,
    volume: number,
    title: string,
    titleNormalized: string,
    authors: Author[] | null,
    observations: string,
    createdAt: Date,
  ): Book {
    return new Book(
      id,
      publicId,
      cardNumber,
      callNumber,
      deweyCategory,
      copies,
      volume,
      title,
      titleNormalized,
      authors,
      observations,
      createdAt
    );
  }
}
