import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from './core/services/change-language.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bright-charge-web';
  isResolving = false;
  constructor(
    private changeLanguageService: ChangeLanguageService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isResolving = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isResolving = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.changeLanguageService.configInitialLanguage();
  }
}
