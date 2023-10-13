import { AuditData, PaginationParams } from 'src/app/core/api/api.model';
import { DocumentType, Operator } from '../operator.model';

export class CreateOperator {
  static readonly type = '[Operators] Create';
  constructor(
    public createData: {
      logoImage?: File | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      phoneNumber?: string | null | undefined;
      landlineNumber?: string | null | undefined;
      address?: string | null | undefined;
      cpoDocumentDto:
        | {
            issuanceDate?: string | null | undefined;
            documentId?: number | null | undefined;
            issuanceOffice?: string | null | undefined;
            documentType?: DocumentType | null | undefined;
            document?: File | null | undefined;
          }[]
        | undefined;
    }
  ) {}
}
export class AddOperator {
  static readonly type = '[Operators] Add directly to state';
  constructor(public addData: Operator) {}
}
export class EditOperator {
  static readonly type = '[Operators] Edit';
  constructor(
    public editData: {
      logoImage?: File | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      phoneNumber?: string | null | undefined;
      landlineNumber?: string | null | undefined;
      address?: string | null | undefined;
      cpoDocumentDto:
        | {
            issuanceDate?: string | null | undefined;
            documentId?: number | null | undefined;
            issuanceOffice?: string | null | undefined;
            documentType?: DocumentType | null | undefined;
            document?: File | null | undefined;
          }[]
        | undefined;
    },
    operatorMetadata: AuditData
  ) {}
}

export class FetchOperators {
  static readonly type = '[operators] Get';
}
export class PaginateOperators {
  static readonly type = '[operators] Paginate';
  constructor(public params: PaginationParams) {}
}
export class DeleteOperators {
  static readonly type = '[operators] Delete';
  constructor(public ids: number[]) {}
}
