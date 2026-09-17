import { Author } from "../model/author/author.model";
import { AuthorModel } from "../model/author/author.model-database";

export class AuthorMapper {
  static toEntity(authorModel: AuthorModel): Author {
    return Author.create(
      authorModel.id,
      authorModel.uuid,
      authorModel.nombre,
      authorModel.nombre_normalizado
    );
  }

  static listToEntity(authorModels: AuthorModel[]): Author[] {
    return authorModels.map((authorModel) => this.toEntity(authorModel));
  }
}
