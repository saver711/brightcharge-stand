import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { urlToFile } from 'src/app/core/utils/urls-to-files';
import {
  BEOperator,
  ConvertedCpoDocument,
  Operator,
} from '../../operator.model';

@Injectable({
  providedIn: 'root',
})
export class OperatorMediaConversionService {
  constructor(private sanitizer: DomSanitizer) {}

  convertOperatorMediaToFiles(operator: BEOperator): Observable<Operator> {
    // Convert the logo image URL to a File
    const logoImageSafeUrl = urlToFile(
      operator.logoUrl,
      operator.name,
      this.sanitizer
    );

    // Convert each document's URL to a File
    const documentFiles$ = operator.cpoDocuments.map(
      (document): Observable<ConvertedCpoDocument> => {
        return urlToFile(
          document.documentUrl,
          document.documentType as string,
          this.sanitizer
        ).pipe(
          switchMap(file => {
            const newDocument = {
              document: file,
              documentId: document.documentId,
              issuanceOffice: document.issuanceOffice,
              documentType: document.documentType,
              id: document.id,
              issuanceDate: document.issuanceDate,
            };
            return of(newDocument);
          })
        );
      }
    );

    // Use forkJoin to convert all media URLs in parallel

    return forkJoin({
      logoImage: logoImageSafeUrl,
      cpoDocuments: forkJoin(documentFiles$),
    }).pipe(
      switchMap(mediaFiles => {
        const newOperator: Operator = {
          address: operator.address,
          email: operator.email,
          id: operator.id,
          landlineNumber: operator.landlineNumber,
          name: operator.name,
          phoneNumber: operator.phoneNumber,
          cpoDocuments: mediaFiles.cpoDocuments,
          logoImage: mediaFiles.logoImage,
          creationDate: operator.creationDate,
          createdBy: operator.createdBy,
          lastModifiedBy: operator.lastModifiedBy,
          lastModifiedDate: operator.lastModifiedDate,
        };
        return of(newOperator);
      })
      // catchError((error) => {
      //   console.error('Error converting media URLs to Files:', error);
      //   return of(operator);
      // })
    );
  }
}
