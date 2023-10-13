import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { ChangeLanguageService } from 'src/app/core/services/change-language.service';

type DropdownItem = {
  label: string;
  localization: string;
  key: string;
  icon: string;
};
@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  routerSubscription!: Subscription;
  items: DropdownItem[] = [
    {
      label: 'English',
      localization: 'localization.english',
      key: 'en',
      icon: 'bg-flag bg-flag-us',
    },
    {
      label: 'Arabic',
      localization: 'localization.arabic',
      key: 'ar',
      icon: 'bg-flag bg-flag-eg',
    },
  ];
  selectedLanguage: DropdownItem | undefined;
  showBackToLoginLing = true;

  constructor(
    private translate: TranslateService,
    private changeLanguageService: ChangeLanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe({
      next: () => (this.showBackToLoginLing = this.router.url !== '/login'),
    });
    this.selectedLanguage = this.items.find(
      item => item.localization === this.changeLanguageService.selectedLanguage
    );
  }

  changeLanguage(event: DropdownChangeEvent) {
    const key = event.value.key;
    this.changeLanguageService.changeLanguageTo(this.translate, key);
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
