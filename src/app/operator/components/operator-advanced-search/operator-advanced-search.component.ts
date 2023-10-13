/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { OverlayOptions } from 'primeng/api';
import { Observable, Subscription, withLatestFrom } from 'rxjs';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { isTouchDevice } from 'src/app/core/utils/isTouchDevice';
import { preventClosingPrimeOverlay } from 'src/app/core/utils/prevent-closing-prime-overlay';
import { SubscriptionPlan } from 'src/app/shared/types/shared-models.types';
import { GetUsers } from 'src/app/user/state/user.actions';
import { User } from 'src/app/user/user.model';
import { SearchFormControls } from '../../operator.model';
import { OperatorService } from '../../services/operator.service';
import { AppliedFilter } from 'src/app/shared/components/table/table.model';
import { Position } from 'src/app/shared/shared.model';
import { UserState } from 'src/app/user/state/user.state';

@Component({
  selector: 'bs-operator-advanced-search',
  templateUrl: './operator-advanced-search.component.html',
  styleUrls: ['./operator-advanced-search.component.scss'],
})
export class OperatorAdvancedSearchComponent implements OnInit, OnDestroy {
  @Input() position!: Position;
  @Input() visibility!: boolean;
  @Input() searchForm!: FormGroup<SearchFormControls>;
  @Input() formSubmitted = false;
  @Output() handleClose = new EventEmitter();
  @Output() passAppliedFilters = new EventEmitter<AppliedFilter[]>();
  @Output() triggerFilter = new EventEmitter();
  @Output() onShowEmitter = new EventEmitter();
  subscriptionPlans: SubscriptionPlan[] = [];
  creationDate_subscription: Subscription | undefined;
  update_at_date_subscription: Subscription | undefined;
  isFetchingUsers = false;
  fetchingUsersError: string | null = null;
  searchingError: string | null = null;
  @Select(UserState.users) users$!: Observable<User[]>;
  users: User[] | undefined;

  constructor(
    private store: Store,
    private operatorService: OperatorService
  ) {}

  close() {
    this.handleClose.emit();
  }

  getUsers() {
    this.isFetchingUsers = true;
    this.fetchingUsersError = null;
    this.store
      .dispatch(new GetUsers())
      .pipe(withLatestFrom(this.users$))
      .subscribe({
        next: ([_, users]) => {
          this.users = users;
          this.isFetchingUsers = false;
        },
        error: (error: ErrorResponse) => {
          this.fetchingUsersError = getErrorMessage(error.error.errorCode);
          this.isFetchingUsers = false;
        },
      });
  }
  ngOnInit(): void {
    this.getUsers();
    // Dependency disable
    this.creationDate_subscription = this.searchForm
      .get('creationDate')
      ?.valueChanges.subscribe({
        next: date => {
          if (date) {
            this.searchForm.get('created_till_date')?.enable();
          } else {
            this.searchForm.get('created_till_date')?.disable();
            this.searchForm.patchValue({
              created_till_date: null,
            });
          }
        },
      });
    this.update_at_date_subscription = this.searchForm
      .get('lastModifiedDate')
      ?.valueChanges.subscribe({
        next: date => {
          if (date) {
            this.searchForm.get('updated_till_date')?.enable();
          } else {
            this.searchForm.get('updated_till_date')?.disable();
            this.searchForm.patchValue({
              updated_till_date: null,
            });
          }
        },
      });

    // FIXME: Get subscriptionPlans from backend
    this.subscriptionPlans = [
      { name: 'plan1', id: 'id1' },
      { name: 'plan2', id: 'id2' },
      { name: 'plan3', id: 'id3' },
      { name: 'plan4', id: 'id4' },
    ];
  }

  onShow() {
    this.onShowEmitter.emit();
  }

  // prevent dropdown and multiselect from closing onScroll
  getDropdownOverlayOptions(): OverlayOptions {
    return preventClosingPrimeOverlay();
  }
  getMultiselectOverlayOptions(): OverlayOptions {
    return preventClosingPrimeOverlay();
  }

  isTouchDevice() {
    return isTouchDevice();
  }

  onReset() {
    this.searchForm.reset();
  }

  onSubmit() {
    this.formSubmitted = true;

    const formValue = this.searchForm.value;
    const appliedFilters =
      this.operatorService.getTableAppliedFilters(formValue);
    this.passAppliedFilters.emit(appliedFilters);

    this.triggerFilter.emit();
    this.close();
  }

  ngOnDestroy(): void {
    this.creationDate_subscription?.unsubscribe();
    this.update_at_date_subscription?.unsubscribe();
  }
}
