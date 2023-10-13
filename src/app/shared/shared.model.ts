import { TableLazyLoadEvent } from 'primeng/table';

export type Position =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topleft'
  | 'topright'
  | 'bottomleft'
  | 'bottomright';

export type DateTimeFormatOptions = {
  localeMatcher?: 'best fit' | 'lookup' | undefined;
  weekday?: 'long' | 'short' | 'narrow' | undefined;
  era?: 'long' | 'short' | 'narrow' | undefined;
  year?: 'numeric' | '2-digit' | undefined;
  month?: 'long' | 'short' | 'narrow' | undefined;
  day?: 'numeric' | '2-digit' | undefined;
  hour?: 'numeric' | '2-digit' | undefined;
  minute?: 'numeric' | '2-digit' | undefined;
  second?: 'numeric' | '2-digit' | undefined;
  timeZoneName?:
    | 'long'
    | 'short'
    | 'shortOffset'
    | 'longOffset'
    | 'shortGeneric'
    | 'longGeneric'
    | undefined;
  formatMatcher?: 'best fit' | 'basic' | undefined;
  hour12?: boolean;
  timeZone?: string;
};

export type CustomTableLazyLoadEvent = TableLazyLoadEvent & {
  // Add your custom fields here
  pageNum?: number;
};
