import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Position } from '@shared/shared.model';
import { POSITIONS } from '@shared/utils/constants';
import { Subscription } from 'rxjs';
import { LanguageKey } from 'src/app/core/utils/core.types';

@Component({
  selector: 'bs-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  activePath = 'dashboard';
  chPointsSideBarVisibility = false;
  sidebarPosition: Position =
    POSITIONS[
      (this.translateService.currentLang ||
        this.translateService.defaultLang) as LanguageKey
    ];
  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activePath = this.router.url.slice(1);
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activePath = event.url.slice(1);
      }
    });
  }

  isActiveRoute(path: string) {
    // I need to enable this if the routerLink for home icon is not "/dashboard"
    // return this.activePath === path || this.activePath === "";
    return this.activePath.includes(path);
  }

  getIconSrc(path: string, iconName: string) {
    return this.isActiveRoute(path)
      ? `../../../../assets/icons/${iconName}-colored.svg`
      : `../../../../assets/icons/${iconName}.svg`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
