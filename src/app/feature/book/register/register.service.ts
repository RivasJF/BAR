import { inject, Injectable } from '@angular/core';
import { AUTHOR_REPOSITORY, AuthorRepository } from '../model/author/autor.repository';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private authorRespository = inject<AuthorRepository>(AUTHOR_REPOSITORY);
}
