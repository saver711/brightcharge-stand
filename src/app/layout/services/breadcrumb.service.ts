import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { capitalizeFirstLetter } from 'src/app/core/utils/capitalize-first-letter';
import { BehaviorSubject, Observable } from 'rxjs';

export type BreadcrumbItem = {
  label: string;
  routerLink: string;
};

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService implements OnDestroy {
  private breadcrumbsSubject: BehaviorSubject<BreadcrumbItem[]> =
    new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbs$: Observable<BreadcrumbItem[]> =
    this.breadcrumbsSubject.asObservable();
  subscription!: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initBreadcrumbs();
  }

  private initBreadcrumbs() {
    const initBread = this.getBreadcrumbs(this.activatedRoute.root);
    this.breadcrumbsSubject.next(initBread);
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getBreadcrumbs(this.activatedRoute.root);
      });
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;

        child.data.subscribe(data => {
          const labelString =
            data['breadcrumb'] || data['data']?.['breadcrumb'];
          if (labelString) {
            const label = capitalizeFirstLetter(labelString);
            breadcrumbs.push({
              label,
              routerLink: url,
            });
            this.breadcrumbsSubject.next(breadcrumbs);
          }
        });
      }
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
