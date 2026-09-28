import { NewAuthor } from "./newAuthor.model";

export class Author {
  private constructor(
    public readonly id: number,
    public readonly publicId: string,
    public readonly name: string,
    public readonly standardizedName: string,
  ) { }

  static create(
    id: number,
    publicId: string,
    name: string,
    standardizedName: string
  ): Author {
    return new Author(id, publicId, name, standardizedName)
  }

  static fromNew(newAuthor: NewAuthor, id = 0): Author {
    return Author.create(
      id,
      newAuthor.publicId,
      newAuthor.name,
      newAuthor.standardizedName,
    );
  }

  getId(): number {
    return this.id;
  }

  getPublicId(): string {
    return this.publicId;
  }

  getName(): string {
    return this.name;
  }

  getStandardizedName(): string {
    return this.standardizedName;
  }
}
