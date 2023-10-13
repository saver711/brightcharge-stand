import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  StateToken,
  Store,
} from '@ngxs/store';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import {
  AuditData,
  BSFile,
  ELEMENTS_PER_PAGE,
} from 'src/app/core/api/api.model';
import { dateFormatter } from 'src/app/core/utils/date-formatter';
import { SessionState } from 'src/app/user-management/state/session.state';
import { SessionModel } from 'src/app/user-management/state/user-management.state.model';
import {
  CreateOperatorData,
  EditOperatorData,
  Operator,
  OperatorStateModel,
} from '../operator.model';
import { OperatorMediaConversionService } from '../services/operator-media-conversion/operator-media-conversion.service';
import { OperatorService } from '../services/operator.service';
import {
  AddOperator,
  CreateOperator,
  DeleteOperators,
  EditOperator,
  FetchOperators,
  PaginateOperators,
} from './operator.actions';

const OPERATORS_SATE_TOKEN = new StateToken<OperatorStateModel>('operators');

@State<OperatorStateModel>({
  name: OPERATORS_SATE_TOKEN,
  defaults: {
    operators: null,
  },
})
@Injectable()
export class OperatorState {
  constructor(
    private operatorService: OperatorService,
    private operatorMediaConversionService: OperatorMediaConversionService,
    private store: Store
  ) {}

  @Action(AddOperator)
  AddOperator(
    ctx: StateContext<OperatorStateModel>,
    payload: { addData: Operator }
  ) {
    const state = ctx.getState();
    const operatorExists = !!state.operators?.content.find(
      operator => operator.id === payload.addData.id
    );
    if (!operatorExists) {
      if (state.operators) {
        ctx.patchState({
          operators: {
            ...state.operators,
            content: [...state.operators.content, payload.addData],
          },
        });
      } else {
        ctx.patchState({
          operators: {
            totalElements: 1,
            totalPages: 1,
            content: [payload.addData],
          },
        });
      }
    }
  }

  @Action(CreateOperator)
  CreateOperator(
    ctx: StateContext<OperatorStateModel>,
    payload: { createData: CreateOperatorData }
  ) {
    return this.operatorService.createOperator(payload.createData).pipe<number>(
      tap(id => {
        const userState: SessionModel = this.store.selectSnapshot(SessionState);
        const state = ctx.getState();
        const newOperator: Operator = {
          name: payload.createData.name,
          email: payload.createData.email,
          address: payload.createData.address,
          phoneNumber: payload.createData.phoneNumber,
          landlineNumber: payload.createData.landlineNumber,
          id,
          logoImage: payload.createData.logoImage as BSFile,
          cpoDocuments: payload.createData.cpoDocumentDto,
          creationDate: dateFormatter(new Date()),
          lastModifiedDate: dateFormatter(new Date()),
          lastModifiedBy: userState.username,
          createdBy: userState.username,
        };

        if (state.operators) {
          ctx.patchState({
            operators: {
              totalElements: (state.operators.totalElements || 0) + 1,
              totalPages: Math.ceil(
                (state.operators.totalElements || 0) + 1 / ELEMENTS_PER_PAGE
              ),

              content: [...state.operators.content, newOperator],
            },
          });
        } else {
          ctx.patchState({
            operators: {
              totalElements: 1,
              totalPages: 1,

              content: [newOperator],
            },
          });
        }
      })
    );
  }

  @Action(EditOperator)
  EditOperator(
    ctx: StateContext<OperatorStateModel>,
    payload: { editData: EditOperatorData; operatorMetadata: AuditData }
  ) {
    return this.operatorService.editOperator(payload.editData).pipe(
      tap({
        next: editedOperatorId => {
          const state = ctx.getState();
          if (state.operators) {
            const index = state.operators.content.findIndex(operator => {
              return operator.id === editedOperatorId;
            });
            if (index !== -1) {
              const updatedOperators = [...state.operators.content];
              updatedOperators[index] = {
                name: payload.editData.name,
                email: payload.editData.email,
                address: payload.editData.address,
                phoneNumber: payload.editData.phoneNumber,
                landlineNumber: payload.editData.landlineNumber,
                id: payload.editData.id,
                logoImage: payload.editData.logoImage as BSFile,
                cpoDocuments: payload.editData.cpoDocumentDto,
                ...payload.operatorMetadata,
              };

              ctx.patchState({
                operators: {
                  ...state.operators,
                  content: updatedOperators,
                },
              });
            }
          }
        },
      })
    );
  }

  @Action(FetchOperators)
  FetchOperators(ctx: StateContext<OperatorStateModel>) {
    return this.operatorService.fetchOperators().pipe(
      switchMap(response => {
        return forkJoin(
          // FIXME: Delete slice
          response.content.map(operator => {
            return this.operatorMediaConversionService.convertOperatorMediaToFiles(
              operator
            );
          })
        ).pipe(
          tap(operators => {
            ctx.patchState({
              operators: {
                content: operators,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
              },
            });
          })
        );
      })
    );
  }

  @Action(PaginateOperators)
  paginateOperators(
    ctx: StateContext<OperatorStateModel>,
    action: PaginateOperators
  ) {
    return this.operatorService
      .paginateOperators({
        pageNum: action.params.pageNum,
        pageSize: action.params.pageSize,
        sortBy: action.params.sortBy,
        direction: action.params.direction,
        searchCriteria: action.params.searchCriteria,
      })
      .pipe(
        tap(operatorsResponse => {
          const operators = operatorsResponse.content;

          if (operators.length > 0) {
            ctx.patchState({
              operators: {
                content: operators,
                totalElements: operatorsResponse.totalElements,
                totalPages: operatorsResponse.totalPages,
              },
            });
          } else {
            ctx.patchState({
              operators: {
                content: [],
                totalElements: operatorsResponse.totalElements,
                totalPages: operatorsResponse.totalPages,
              },
            });
          }
        })
      );
  }

  @Action(DeleteOperators)
  DeleteOperators(
    ctx: StateContext<OperatorStateModel>,
    payload: DeleteOperators
  ) {
    const ids = payload.ids;
    return this.operatorService.deleteOperators(ids).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const operators = state.operators;
          if (operators) {
            const updatedOperators = operators.content.filter(
              operator => !ids.includes(operator.id)
            );
            ctx.patchState({
              operators: {
                ...state.operators,
                content: updatedOperators,
              },
            });
          }
        },
      })
    );
  }

  @Selector()
  static operators(state: OperatorStateModel) {
    return state.operators?.content;
  }
  @Selector()
  static resolvedOperators(state: OperatorStateModel) {
    return state.operators;
  }
}
