import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { BSFile } from '../api/api.model';

export const urlToFile = (
  url: string,
  name: string,
  sanitizer: DomSanitizer
): Observable<BSFile> => {
  return new Observable(observer => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        // FIXME: will get file name by splicing it from the url, but the backend should provide it in the url first
        const file = new File(
          [blob],
          `${name}.${blob.type.slice(blob.type.lastIndexOf('/') + 1)}`,
          {
            type: blob.type,
          }
        );
        const objectURL = URL.createObjectURL(file);
        const safeUrl = sanitizer.bypassSecurityTrustUrl(objectURL);
        const fileWithUrl: BSFile = file as BSFile;
        fileWithUrl.objectURL = safeUrl;
        observer.next(fileWithUrl);
        observer.complete();
      })
      .catch(error => {
        observer.error(error);
      });
  });
};
