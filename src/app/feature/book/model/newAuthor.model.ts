export class NewAuthor {
  private constructor(
    public readonly publicId: string,
    public readonly name: string,
    public readonly standardizedName: string,
  ) { }

  static create(
    name: string
  ): NewAuthor {
    const publicId = crypto.randomUUID()
    name = name.trim()
    return new NewAuthor(publicId, name, name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  }
}
