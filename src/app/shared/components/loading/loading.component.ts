import { Component, Input } from '@angular/core';

@Component({
  selector: 'bs-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() message = 'Loading data, please wait ...';
}
