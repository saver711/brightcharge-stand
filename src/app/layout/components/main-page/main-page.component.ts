import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { BreadcrumbService } from '../../services/breadcrumb.service';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bs-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainPageComponent implements OnInit, OnDestroy {
  items: any = [];
  home: MenuItem | undefined;
  subscription!: Subscription;

  chPointsSideBarVisibility = false;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.breadcrumbService.breadcrumbs$.subscribe(
      breadcrumbs => {
        this.items = breadcrumbs;
      }
    );
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
