import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bs-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() showDialog!: boolean;
  @Input() header = '';
  @Input() confirmLabel = 'Delete';
  @Output() closeDialog = new EventEmitter();
  @Output() ConfirmDialog = new EventEmitter();

  closeModal() {
    this.closeDialog.emit();
  }
  confirmationAction() {
    this.ConfirmDialog.emit();
  }
}
