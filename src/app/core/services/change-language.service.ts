import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageKey } from '../utils/core.types';

const LOCALIZATION_LANGUAGE = {
  en: 'localization.english',
  ar: 'localization.arabic',
};

const DIRECTIONS = {
  en: 'ltr',
  ar: 'rtl',
};

@Injectable({
  providedIn: 'root',
})
export class ChangeLanguageService {
  private renderer!: Renderer2;
  private initialLang = (this.translateService.currentLang ||
    this.translateService.defaultLang) as LanguageKey;

  selectedLanguage = LOCALIZATION_LANGUAGE[this.initialLang];

  constructor(
    private translateService: TranslateService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  changeLanguageTo(translate: TranslateService, langKey: LanguageKey) {
    this.changeLanguageHandler(langKey, translate);
  }

  toggleLanguage(translate: TranslateService) {
    const currentLang = translate.currentLang as LanguageKey;
    if (currentLang === 'ar') {
      this.changeLanguageHandler('en', translate);
      return;
    }
    this.changeLanguageHandler('ar', translate);
  }

  configInitialLanguage() {
    this.changeDirectionTo(this.initialLang);
  }

  changeDirectionTo(langKey: LanguageKey) {
    const htmlElement = document.querySelector('html')!;
    this.renderer.setAttribute(htmlElement, 'lang', langKey);

    this.renderer.setAttribute(htmlElement, 'dir', DIRECTIONS[langKey]);
  }

  changeLanguageHandler(langKey: LanguageKey, translate: TranslateService) {
    translate.use(langKey);

    this.changeDirectionTo(langKey);
    localStorage.setItem('lang', langKey);
    this.selectedLanguage = LOCALIZATION_LANGUAGE[langKey];
  }

  //.....
}
