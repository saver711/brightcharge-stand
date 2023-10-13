import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'deepmerge-ts';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
