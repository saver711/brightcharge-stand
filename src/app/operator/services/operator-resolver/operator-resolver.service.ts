import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Operator } from '../../operator.model';
import { AddOperator } from '../../state/operator.actions';
import { OperatorState } from '../../state/operator.state';
import { OperatorMediaConversionService } from '../operator-media-conversion/operator-media-conversion.service';
import { OperatorService } from '../operator.service';

@Injectable({
  providedIn: 'root',
})
export class OperatorResolverService {
  constructor(
    private operatorService: OperatorService,
    private store: Store,
    private operatorMediaConversionService: OperatorMediaConversionService
  ) {}
  @Select(OperatorState.operators) operators$!: Observable<Operator[]>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.resolveOperatorFunctionality(route, state);
  }

  resolveOperatorFunctionality(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const url = state.url;
    const isInEditPage =
      url.includes('edit') && route.routeConfig?.path === 'edit';
    const operatorPathId = (url.match(/\/(\d+)\/edit/) || [])[1];
    const operatorId: number = route.params['operatorId'] || operatorPathId;
    const operators = this.store.selectSnapshot(OperatorState.operators);

    if (operators && !isInEditPage) {
      const operator = operators?.find(operator => {
        return operator.id == operatorId;
      });
      if (operator) {
        const data = {
          breadcrumb: operator.name,
          operator,
        };
        return of(data);
      } else {
        return this.resolveFromBE(operatorId, isInEditPage);
      }
    } else {
      return this.resolveFromBE(operatorId, isInEditPage);
    }
  }

  resolveFromBE(operatorId: number, isInEditPage: boolean) {
    return this.operatorService.getOperatorById(operatorId).pipe(
      switchMap(operator => {
        return this.operatorMediaConversionService
          .convertOperatorMediaToFiles(operator)
          .pipe(
            switchMap(operator => {
              this.store.dispatch(new AddOperator(operator));
              if (operator && !isInEditPage) {
                const data = {
                  breadcrumb: operator.name,
                  operator,
                };
                return of(data);
              } else if (operator && isInEditPage) {
                const data = {
                  breadcrumb: 'Edit',
                  operator,
                };
                return of(data);
              } else {
                return of(null);
              }
            }),
            catchError(() => {
              return of(null);
            })
          );
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
}

export const OperatorResolverGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(OperatorResolverService).resolve(route, state);
};
