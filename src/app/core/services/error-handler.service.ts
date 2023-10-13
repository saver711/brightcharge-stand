import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorResponse } from '../api/api.model';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private messageService: MessagesService,
    private router: Router
  ) {}

  handle(error: ErrorResponse) {
    switch (error.status) {
      case 401:
      case 403: {
        this.messageService.showErrorStatusMessageToast(
          error.status,
          error.error.errorMessage
        );
        break;
      }
      case 410: {
        this.messageService.showErrorStatusMessageToast(
          error.status,
          error.error.errorMessage
        );
        break;
      }
      case 404: {
        this.messageService.showErrorStatusMessageToast(
          error.status,
          error.error.errorMessage
        );
        break;
      }
      case 406:
      case 400:
        this.messageService.showErrorStatusMessageToast(
          error.status,
          error.error.errorMessage
        );
        break;
      case 500: {
        this.messageService.showErrorStatusMessageToast(
          error.status,
          error.error.errorMessage
        );
        break;
      }
      // case 0: {
      //   this.messageService.showErrorMessageToast('Server is Down!');
      //   break;
      // }
      default: {
        if (error.error && error.error.errorMessage) {
          this.messageService.showErrorStatusMessageToast(
            error.status,
            error.error.errorMessage.valueOf()
          );
        }
      }
    }
  }
}
