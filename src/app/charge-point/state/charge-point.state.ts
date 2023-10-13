import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  StateToken,
  Store,
} from '@ngxs/store';
import { tap } from 'rxjs';
import { ChargePoint, ChargePointStateModel } from '../charge-point.model';
import { ChargePointService } from '../services/charge-point.service';
import {
  AddChargePoint,
  FetchChargePoints,
  PaginateChargePoints,
  deleteChargePoints,
} from './charge-point.actions';

const STATIONS_SATE_TOKEN = new StateToken<ChargePointStateModel>(
  'chargePoints'
);

@State<ChargePointStateModel>({
  name: STATIONS_SATE_TOKEN,
  defaults: {
    chargePoints: null,
  },
})
@Injectable()
export class ChargePointState {
  constructor(
    private chargePointService: ChargePointService,
    private store: Store
  ) {}

  @Action(AddChargePoint)
  AddChargePoint(
    ctx: StateContext<ChargePointStateModel>,
    payload: { addData: ChargePoint }
  ) {
    const state = ctx.getState();
    const chargePointExists = !!state.chargePoints?.content.find(
      chargePoint => chargePoint.id === payload.addData.id
    );
    if (!chargePointExists) {
      if (state.chargePoints) {
        ctx.patchState({
          chargePoints: {
            ...state.chargePoints,
            content: [...state.chargePoints.content, payload.addData],
          },
        });
      } else {
        ctx.patchState({
          chargePoints: {
            totalElements: 1,
            totalPages: 1,
            content: [payload.addData],
          },
        });
      }
    }
  }

  // @Action(CreateChargePoint)
  // CreateChargePoint(
  //   ctx: StateContext<ChargePointStateModel>,
  //   payload: { createData: CreateChargePointData }
  // ) {
  //   return this.chargePointService.createChargePoint(payload.createData).pipe<number>(
  //     tap(id => {
  //       const userState: SessionModel = this.store.selectSnapshot(SessionState);
  //       const state = ctx.getState();
  //       const newChargePoint: ChargePoint = {};

  //       if (state.chargePoints) {
  //         ctx.patchState({
  //           chargePoints: {
  //             totalElements: (state.chargePoints.totalElements || 0) + 1,
  //             totalPages: Math.ceil(
  //               (state.chargePoints.totalElements || 0) + 1 / ELEMENTS_PER_PAGE
  //             ),

  //             content: [...state.chargePoints.content, newChargePoint],
  //           },
  //         });
  //       } else {
  //         ctx.patchState({
  //           chargePoints: {
  //             totalElements: 1,
  //             totalPages: 1,

  //             content: [newChargePoint],
  //           },
  //         });
  //       }
  //     })
  //   );
  // }

  // @Action(EditChargePoint)
  // EditChargePoint(
  //   ctx: StateContext<ChargePointStateModel>,
  //   payload: { editData: EditChargePointData; chargePointMetadata: AuditData }
  // ) {
  //   return this.chargePointService.editChargePoint(payload.editData).pipe(
  //     tap({
  //       next: editedChargePointId => {
  //         const state = ctx.getState();
  //         if (state.chargePoints) {
  //           const index = state.chargePoints.content.findIndex(chargePoint => {
  //             return chargePoint.id === editedChargePointId;
  //           });
  //           if (index !== -1) {
  //             const updatedChargePoints = [...state.chargePoints.content];
  //             updatedChargePoints[index] = {
  //               name: payload.editData.name,
  //               email: payload.editData.email,
  //               address: payload.editData.address,
  //               phoneNumber: payload.editData.phoneNumber,
  //               landlineNumber: payload.editData.landlineNumber,
  //               id: payload.editData.id,
  //               logoImage: payload.editData.logoImage as BSFile,
  //               cpoDocuments: payload.editData.cpoDocumentDto,
  //               ...payload.chargePointMetadata,
  //             };

  //             ctx.patchState({
  //               chargePoints: {
  //                 ...state.chargePoints,
  //                 content: updatedChargePoints,
  //               },
  //             });
  //           }
  //         }
  //       },
  //     })
  //   );
  // }

  @Action(FetchChargePoints)
  FetchChargePoints(ctx: StateContext<ChargePointStateModel>) {
    return this.chargePointService.fetchChargePoints().pipe(
      tap(chargePoints => {
        ctx.setState({
          chargePoints,
        });
      })
    );
  }

  @Action(PaginateChargePoints)
  paginateChargePoints(
    ctx: StateContext<ChargePointStateModel>,
    action: PaginateChargePoints
  ) {
    return this.chargePointService
      .paginateChargePoints({
        pageNum: action.params.pageNum,
        pageSize: action.params.pageSize,
        sortBy: action.params.sortBy,
        direction: action.params.direction,
        searchCriteria: action.params.searchCriteria,
      })
      .pipe(
        tap(chargePoints => {
          if (chargePoints.content.length > 0) {
            ctx.setState({
              chargePoints,
            });
          } else {
            ctx.patchState({
              chargePoints: {
                content: [],
                totalElements: chargePoints.totalElements,
                totalPages: chargePoints.totalPages,
              },
            });
          }
        })
      );
  }

  @Action(deleteChargePoints)
  deleteChargePoints(
    ctx: StateContext<ChargePointStateModel>,
    payload: deleteChargePoints
  ) {
    const ids = payload.ids;
    return this.chargePointService.deleteChargePoints(ids).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const chargePoints = state.chargePoints;
          if (chargePoints) {
            const updatedChargePoints = chargePoints.content.filter(
              chargePoint => !ids.includes(chargePoint.id)
            );
            ctx.patchState({
              chargePoints: {
                ...state.chargePoints,
                content: updatedChargePoints,
              },
            });
          }
        },
      })
    );
  }

  @Selector()
  static chargePoints(state: ChargePointStateModel) {
    return state.chargePoints?.content;
  }
  @Selector()
  static resolvedChargePoints(state: ChargePointStateModel) {
    return state.chargePoints;
  }
}
