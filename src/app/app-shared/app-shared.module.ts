import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingOverlayComponent } from '../shared/components/loading-overlay/loading-overlay.component';
import { BlockUIModule } from 'primeng/blockui';

const SHARED_MODULES = [BlockUIModule];

const SHARED_COMPONENTS = [
  // Components
  LoadingOverlayComponent,
  // Directives
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, ...SHARED_MODULES],
  // providers: [],
  exports: [...SHARED_MODULES, ...SHARED_COMPONENTS],
})
export class AppSharedModule {}
