import { Component, Input } from '@angular/core';

@Component({
  selector: 'bs-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent {
  @Input() blocked = false;
  @Input() message = 'Loading data, please wait ...';
}
