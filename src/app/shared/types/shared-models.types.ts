export interface enumOption {
  label: string;
  value: string;
}

export interface MultiSelectOption {
  [key: string]: string;
}

export interface column {
  field: string;
  header: string;
  filterType?: string;
  enumOptions?: enumOption[];
  multiSelectOptions?: MultiSelectOption[];
  filterOption?: string;
  filterValue?: any;
  width?: string;
  showOnLoad?: boolean;
  filterOperation?: string;
}

export interface exportTableOption {
  label: string;
  icon: string;
  command: () => void;
}

export interface DetailTableTab {
  tabHeader: string;
  tabContent: {
    masterField: string;
    detailCols: column[];
  };
}

export interface MasterRowTableHeader {
  tabHeader: string;
  detailCols: column[];
}

export type SubscriptionPlan = {
  name: string;
  id: string;
};
