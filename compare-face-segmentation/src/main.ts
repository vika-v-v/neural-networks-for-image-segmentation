import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module'; // Make sure the path matches where you created app.module.ts

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
