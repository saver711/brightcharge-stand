import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  showSuccessMessageToast(message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 5000,
    });
  }

  showSuccessWithTranslationMessageToast(message: string) {
    this.translate.get(message).subscribe({
      next: (translatedMsg: string) => {
        this.messageService.clear();
        this.messageService.add({
          key: 'success',
          severity: 'success',
          summary: 'Success',
          detail: translatedMsg,
          life: 5000,
        });
      },
    });
  }

  showErrorMessageToast(message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  }

  showErrorStatusMessageToast(status: number, message: string) {
    this.translate.get(message).subscribe({
      next: (translatedMsg: string) => {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: status + ': ' + translatedMsg,
          life: 5000,
        });
      },
    });
  }

  showFileUploadedMessageToast(message?: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: message,
    });
  }
}
