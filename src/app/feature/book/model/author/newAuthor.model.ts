import { DomainError } from "../../../../core/error/domain.error";

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
    if (name.length === 0 || name.length > 255) {
      throw new DomainError('Nombre de autor inválido. Debe tener entre 1 y 255 caracteres.');
    }
    return new NewAuthor(publicId, name, this.standardizeName(name))
  }

  static standardizeName(name: string): string {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
