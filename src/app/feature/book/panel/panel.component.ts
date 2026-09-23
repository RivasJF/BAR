import { Component, OnInit } from '@angular/core';
import { PanelSearchComponent } from './components/panel-search/panel-search.component';
import { PanelContentComponent } from './components/panel-content/panel-content.component';

@Component({
  imports: [PanelSearchComponent, PanelContentComponent],
  selector: 'panel',
	templateUrl: './panel.component.html',
})
export class Panel {
}
