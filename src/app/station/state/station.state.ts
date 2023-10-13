import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { StationService } from '../services/station.service';
import { Station } from '../station.model';
import {
  AddStation,
  ArchiveStations,
  CreateStation,
  FetchStations,
  GetCities,
  GetCountries,
  GetStates,
  PaginateStations,
} from './station.actions';
import { StationStateModel } from './station-state.model';

@State<StationStateModel>({
  name: 'station',
})
@Injectable()
export class StationState {
  constructor(private stationService: StationService) {}

  /**
   * @deprecated This Action should be deleted
   */
  @Action(AddStation)
  AddStation(
    ctx: StateContext<StationStateModel>,
    payload: { addData: Station }
  ) {
    const state = ctx.getState();
    const stationExists = !!state.stations?.content.find(
      (station: { id: number }) => station.id === payload.addData.id
    );
    if (!stationExists) {
      if (state.stations) {
        ctx.patchState({
          stations: {
            ...state.stations,
            content: [...state.stations.content, payload.addData],
          },
        });
      } else {
        ctx.patchState({
          stations: {
            totalElements: 1,
            totalPages: 1,
            content: [payload.addData],
          },
        });
      }
    }
  }

  @Action(FetchStations)
  FetchStations(ctx: StateContext<StationStateModel>) {
    return this.stationService.fetchStations().pipe(
      tap(stations => {
        ctx.setState({
          stations,
        });
      })
    );
  }

  @Action(PaginateStations)
  paginateStations(
    ctx: StateContext<StationStateModel>,
    action: PaginateStations
  ) {
    return this.stationService
      .paginateStations({
        pageNum: action.params.pageNum,
        pageSize: action.params.pageSize,
        sortBy: action.params.sortBy,
        direction: action.params.direction,
        searchCriteria: action.params.searchCriteria,
      })
      .pipe(
        tap(stations => {
          if (stations.content.length > 0) {
            ctx.setState({
              stations,
            });
          } else {
            ctx.patchState({
              stations: {
                content: [],
                totalElements: stations.totalElements,
                totalPages: stations.totalPages,
              },
            });
          }
        })
      );
  }

  @Action(ArchiveStations)
  archiveStations(
    ctx: StateContext<StationStateModel>,
    payload: ArchiveStations
  ) {
    const ids = payload.ids;
    return this.stationService.archiveStations(ids).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const stations = state.stations;
          if (stations) {
            const updatedStations = stations.content.filter(
              (station: { id: number }) => !ids.includes(station.id)
            );
            ctx.patchState({
              stations: {
                ...state.stations,
                content: updatedStations,
              },
            });
          }
        },
      })
    );
  }

  @Action(GetCountries)
  getCountries(ctx: StateContext<StationStateModel>) {
    return this.stationService.getCounties().pipe(
      tap(response => {
        ctx.patchState({ countries: response });
      })
    );
  }

  @Action(GetCities)
  getCities(ctx: StateContext<StationStateModel>, action: GetCities) {
    return this.stationService.getCities(action.payload).pipe(
      tap(response => {
        ctx.patchState({ cities: response });
      })
    );
  }

  @Action(GetStates)
  getCityStates(ctx: StateContext<StationStateModel>, action: GetStates) {
    return this.stationService.getCityStates(action.payload).pipe(
      tap(response => {
        ctx.patchState({ states: response });
      })
    );
  }

  @Action(CreateStation)
  createStation(ctx: StateContext<StationStateModel>, action: CreateStation) {
    return this.stationService.createStation(action.payload);
  }

  @Selector()
  static stations(state: StationStateModel) {
    return state.stations?.content;
  }
  @Selector()
  static resolvedStations(state: StationStateModel) {
    return state.stations;
  }

  @Selector()
  static countries(state: StationStateModel) {
    return state.countries;
  }

  @Selector()
  static cities(state: StationStateModel) {
    return state.cities;
  }

  @Selector()
  static states(state: StationStateModel) {
    return state.states;
  }
}
