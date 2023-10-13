import { FilterMetadata } from 'primeng/api';

export type Column = {
  field: string;
  header: string;
  hidden?: boolean;
  notHidable?: boolean;
  //..
  isRowSelector?: boolean;
  rowReorder?: boolean;
};

export type Filters =
  | {
      [s: string]: FilterMetadata | FilterMetadata[] | undefined;
    }
  | undefined;

export type AppliedFilter = {
  key: string;
  title: string;
  value: string;
  originalValue: any;
};

export enum TableDataTypes {
  TEXT = 'TEXT',
  LINK = 'LINK', // colored hyperlink
  IMAGE_WITH_LINK = 'IMAGE_WITH_LINK', // image with hyperlink
  BOOLEAN = 'BOOLEAN', // ✔ & ❌
  STATUS = 'STATUS', // e.g. Available & Unavailable
  IMAGE_WITH_TEXT = 'IMAGE_WITH_TEXT',
  DATE_TIME = 'DATE_TIME', //23 May 2023,
  // 5:15 PM
  IMAGE = 'IMAGE',
  TOGGLE = 'TOGGLE',
  HIGHLIGHTED = 'HIGHLIGHTED', // colored text
  MULTI_DOTS_WITH_LINK = 'MULTI_DOTS_WITH_LINK',
}

export type ToggleValue = {
  checked: boolean;
  id: number;
};
