import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastLifeTime } from '../../utils/constants';

@Component({
  selector: 'bs-confirmation-toast',
  templateUrl: './confirmation-toast.component.html',
  styleUrls: ['./confirmation-toast.component.scss'],
})
export class ConfirmationToastComponent {
  constructor(private messageService: MessageService) {}
  @Output() confirmEvent = new EventEmitter();
  @Input() life = ToastLifeTime;
  @Input() toastWidth = {};
  messageSeverity: Record<string, string> = {
    success: 'pi pi-check-circle',
    error: 'pi pi-times-circle',
    info: 'pi pi-info-circle',
    warn: 'pi pi-exclamation-triangle',
  };

  onReject() {
    this.messageService.clear();
  }
  viewDetails() {
    this.confirmEvent.emit();
  }
}
