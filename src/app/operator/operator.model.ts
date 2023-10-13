import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { AuditData, BSFile, PaginationProps } from '../core/api/api.model';
import { TableDataTypes } from '../shared/components/table/table.model';
import { User } from '../user/user.model';

// Advanced search form controls
export type SearchFormControls = {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  landlineNumber: FormControl<string | null>;
  address: FormControl<string | null>;

  commercial_register_id: FormControl<string | null>;
  commercial_issuance_office: FormControl<string | null>;
  commercial_issuance_date: FormControl<Date | null>;

  tax_register_id: FormControl<string | null>;
  tax_issuance_office: FormControl<string | null>;
  tax_issuance_date: FormControl<Date | null>;

  electricity_register_id: FormControl<string | null>;
  electricity_issuance_office: FormControl<string | null>;
  electricity_issuance_date: FormControl<Date | null>;

  subscription: FormControl<string | null>;

  createdBy: FormControl<User[] | null>;
  creationDate: FormControl<Date | null>;
  created_till_date: FormControl<Date | null>;

  lastModifiedBy: FormControl<User[] | null>;
  lastModifiedDate: FormControl<Date | null>;
  updated_till_date: FormControl<Date | null>;
};

// Legal document enums
export enum DocumentType {
  COMMERCIAL_REGISTER = 'COMMERCIAL_REGISTER',
  TAX_REGISTER = 'TAX_REGISTER',
  ELECTRICITY_RETAIL_LICENSE = 'ELECTRICITY_RETAIL_LICENSE',
}

// Legal document form controls
export type CpoDocumentsControls = {
  documentId: FormControl<number | null>;
  issuanceOffice: FormControl<string | null>;
  issuanceDate: FormControl<Date | null>;
  documentType: FormControl<DocumentType | null>;
  document: FormControl<File | null>;
};

// Add the if in edit form
export type EditCpoDocumentsControls = CpoDocumentsControls & {
  id: FormControl<number | null>;
};

// general controls for add operator form
type GeneralControls = {
  logoImage: FormControl<File | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  landlineNumber: FormControl<string | null>;
  address: FormControl<string | null>;
};

// general controls for edit operator form
type EditGeneralControls = GeneralControls & {
  id: FormControl<number | null>;
};

// Add operator form controls, will add subscription here later on
export type AddOperatorFormControls = {
  general: FormGroup<GeneralControls>;
  cpoDocuments: FormArray<FormGroup<CpoDocumentsControls>>;
};

// Legal document types
export type CpoDocument = {
  documentId: number;
  issuanceOffice: string | null;
  issuanceDate: string;
  documentType: DocumentType | null;
  document: BSFile;
};

//  types in edit mode
export type EditCpoDocument = CpoDocument & {
  id: number;
};

// Shape of Legal document received from BE
export type BECpoDocument = Omit<CpoDocument, 'document' | 'issuanceDate'> & {
  id: number;
  documentUrl: string;
  issuanceDate: string;
};

// Legal document after media convertor service
export type ConvertedCpoDocument = Omit<
  CpoDocument,
  'document' | 'issuanceDate'
> & {
  id?: number;
  document: BSFile;
  issuanceDate: string;
};

// Operator after media convertor service
export type Operator = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  landlineNumber: string;
  address: string;
  cpoDocuments: ConvertedCpoDocument[];
  logoImage: BSFile;
} & AuditData;

// Operator received from BE
export type BEOperator = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  landlineNumber: string;
  address: string;
  cpoDocuments: BECpoDocument[];
  logoUrl: string;
} & AuditData;
export type EditOperatorFormControls = {
  general: FormGroup<EditGeneralControls>;
  cpoDocuments: FormArray<FormGroup<EditCpoDocumentsControls>>;
};

// Create operator form output
export type CreateOperatorData = {
  name: string;
  email: string;
  phoneNumber: string;
  landlineNumber: string;
  address: string;
  cpoDocumentDto: CpoDocument[];
  logoImage: File;
};

// Edit operator form output
export type EditOperatorData = Omit<CreateOperatorData, 'cpoDocuments'> & {
  id: number;
  cpoDocumentDto: EditCpoDocument[];
};

// Whole operators response from BE
export type OperatorsResponse = { content: BEOperator[] } & PaginationProps;

// Whole operators response after media conversion
export type ConvertedOperators = {
  content: (BEOperator | Operator)[];
} & PaginationProps;

export type OperatorStateModel = {
  operators: ConvertedOperators | null;
};

// Operators table data shape
export type OperatorsTable = { content: OperatorTable[] } & PaginationProps;
export type OperatorTable = {
  id: number;
  name: {
    type: TableDataTypes.IMAGE_WITH_TEXT;
    value: string;
    image: SafeUrl;
  };
  email: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  phoneNumber: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  landlineNumber: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  address: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  cpoDocuments: BECpoDocument[];
  logoUrl: string;
  createdBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  lastModifiedBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  creationDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  lastModifiedDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
};
