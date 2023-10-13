import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ClearInputDirective } from '../core/directives/clear-input/clear-input.directive';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ConfirmationToastComponent } from './components/confirmation-toast/confirmation-toast.component';
import { InputBetterValidationDirective } from '../core/directives/input-better-validation/input-better-validation.directive';
import { httpInterceptorsProviders } from '../core/api/interceptors';
import { DividerModule } from 'primeng/divider';
import { TableComponent } from './components/table/table.component';
import { LoadingComponent } from './components/loading/loading.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BlockUIModule } from 'primeng/blockui';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';

export function HttpLoaderFactory2(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const localLang = localStorage.getItem('lang');

const defaultLanguage =
  localLang === 'en' || localLang === 'ar' ? localLang : 'en';

const SHARED_MODULES = [
  AccordionModule,
  AutoCompleteModule,
  BreadcrumbModule,
  ButtonModule,
  BlockUIModule,
  CalendarModule,
  CardModule,
  CarouselModule,
  CheckboxModule,
  ConfirmDialogModule,
  DataViewModule,
  DialogModule,
  DividerModule,
  DropdownModule,
  DynamicDialogModule,
  FileUploadModule,
  InputMaskModule,
  InputNumberModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  ListboxModule,
  KeyFilterModule,
  MenubarModule,
  MenuModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  MegaMenuModule,
  OverlayPanelModule,
  PasswordModule,
  PaginatorModule,
  PanelModule,
  ProgressSpinnerModule,
  RadioButtonModule,
  ScrollPanelModule,
  SelectButtonModule,
  SidebarModule,
  SliderModule,
  SplitButtonModule,
  TableModule,
  TabViewModule,
  ToastModule,
  ToolbarModule,
  TooltipModule,
  // Angular Modules
  GoogleMapsModule,
];

const SHARED_COMPONENTS = [
  // Components
  ConfirmationToastComponent,
  TableComponent,
  LoadingComponent,
  // Directives
  ClearInputDirective,
  InputBetterValidationDirective,
  ConfirmationModalComponent,
  AlphaNumericDirective,
  // Pipes
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_MODULES,
    TranslateModule.forRoot({
      defaultLanguage,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory2,
        deps: [HttpClient],
      },
      // compiler configuration
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
  ],
  providers: [DialogService, MessageService, httpInterceptorsProviders],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputBetterValidationDirective,
    ClearInputDirective,
    ConfirmationModalComponent,
    ToastModule,
    ConfirmationToastComponent,
    HttpClientModule,
    ...SHARED_MODULES,
    ...SHARED_COMPONENTS,
  ],
})
export class SharedModule {}
