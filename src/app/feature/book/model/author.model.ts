export class Author {
  private constructor(
    public readonly id: string,
    public readonly publicId: string,
    public readonly name: string,
    public readonly standardizedName: string,
  ) { }

  static create(
    id: string,
    publicId: string,
    name: string,
    standardizedName: string
  ): Author {
    return new Author(id, publicId, name, standardizedName)
  }
}
