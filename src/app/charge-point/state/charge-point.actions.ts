import { PaginationParams } from 'src/app/core/api/api.model';
import { ChargePoint } from '../charge-point.model';

export class CreateChargePoint {
  static readonly type = '[ChargePoints] Create';
  // constructor(public createData: {}) {}
}
export class AddChargePoint {
  static readonly type = '[ChargePoints] Add directly to state';
  constructor(public addData: ChargePoint) {}
}
export class EditChargePoint {
  static readonly type = '[ChargePoints] Edit';
  // constructor(
  //   public editData: {},
  //   chargePointMetadata: AuditData
  // ) {}
}

export class FetchChargePoints {
  static readonly type = '[chargePoints] Get';
}
export class PaginateChargePoints {
  static readonly type = '[chargePoints] Paginate';
  constructor(public params: PaginationParams) {}
}
export class deleteChargePoints {
  static readonly type = '[chargePoints] Delete';
  constructor(public ids: number[]) {}
}
