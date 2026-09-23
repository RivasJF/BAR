import { Author } from "../author/author.model";
import { DeweyCategory } from "../deweyCategory.model";

export class Book {

  private constructor(
    public readonly id: number,
    public readonly publicId: string,
    public readonly cardNumber: number | null,
    public readonly callNumber: string | null,
    public readonly deweyCategory: DeweyCategory | null,
    public readonly copies: number,
    public readonly volume: number | null,
    public readonly title: string | null,
    public readonly titleNormalized: string | null,
    public readonly authors: Author[] | null,
    public readonly observations: string | null,
    public readonly createdAt: Date,
  ) { }

  static create(
    id: number,
    publicId: string,
    cardNumber: number | null,
    callNumber: string | null,
    deweyCategory: DeweyCategory,
    copies: number,
    volume: number | null,
    title: string | null,
    titleNormalized: string | null,
    authors: Author[] | null,
    observations: string | null,
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

  public getId(): number {
    return this.id;
  }

  public getPublicId(): string {
    return this.publicId;
  }

  public getCardNumber(): number | null {
    return this.cardNumber;
  }

  public getCallNumber(): string | null {
    return this.callNumber;
  }

  public getDeweyCategory(): DeweyCategory | null {
    return this.deweyCategory;
  }

  public getCopies(): number {
    return this.copies;
  }

  public getVolume(): number | null {
    return this.volume;
  }

  public getTitle(): string | null {
    return this.title;
  }

  public getTitleNormalized(): string | null {
    return this.titleNormalized;
  }

  public getAuthors(): Author[] | null {
    return this.authors;
  }

  public getObservations(): string | null {
    return this.observations;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
