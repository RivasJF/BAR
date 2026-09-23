import { Component } from '@angular/core';
import { TargetBookComponent } from '../target-book/target-book.component';
import { Book } from '../../../model/book/book.model';
import { Author } from '../../../model/author/author.model';

@Component({
  imports: [TargetBookComponent],
	selector: 'panel-content-component',
	templateUrl: './panel-content.component.html'
})
export class PanelContentComponent {

  private autrhors = [Author.create(2, "spublicId", "Jose", "jose"),
  Author.create(3, "dasdasn", "ALE", "ale")
  ];

  books = [
    Book.create(1, "ss", 121, "100", 100, 1, null, "noc", "noc", [this.autrhors[0]], null, new Date()),
    Book.create(2, "publicId", 321, "299", 100, 1, null, "title", "tittle", null, null, new Date()),
    Book.create(3, "spublicId", 543, "234", 100, 1, null, "dsa", "das", [this.autrhors[0],this.autrhors[1]], "sin", new Date()),

  ]
}
