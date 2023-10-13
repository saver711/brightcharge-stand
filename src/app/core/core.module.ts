import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';

export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    { prefix: './assets/i18n/auth_', suffix: '.json' },
  ]);
}

const localLang = localStorage.getItem('lang');

const defaultLanguage =
  localLang === 'en' || localLang === 'ar' ? localLang : 'en';
@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    NgxPermissionsModule.forRoot(),
  ],
  providers: [CookieService, ConfirmationService, MessageService],
})
export class CoreModule {}
