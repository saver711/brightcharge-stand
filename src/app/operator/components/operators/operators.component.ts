import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Observable, Subscription, withLatestFrom } from 'rxjs';
import { ELEMENTS_PER_PAGE, ErrorResponse } from 'src/app/core/api/api.model';
import { LanguageKey } from 'src/app/core/utils/core.types';
import {
  AppliedFilter,
  Column,
} from 'src/app/shared/components/table/table.model';
import {
  ConvertedOperators,
  Operator,
  OperatorTable,
  OperatorsTable,
  SearchFormControls,
} from '../../operator.model';
import {
  DeleteOperators,
  PaginateOperators,
} from '../../state/operator.actions';
import { OperatorState } from '../../state/operator.state';

import { MenuItem } from 'primeng/api';
import { getErrorMessage, getSortDirection } from 'src/app/core/api/api-utils';
import { dateNotBefore } from 'src/app/core/validators/date-not-before';
import { formHasValue } from 'src/app/core/validators/form-has-value';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { BsTableService } from 'src/app/shared/services/table/table.service';
import {
  CustomTableLazyLoadEvent,
  Position,
} from 'src/app/shared/shared.model';
import { REVERSED_POSITIONS } from 'src/app/shared/utils/constants';
import { User } from 'src/app/user/user.model';
import { OperatorService } from '../../services/operator.service';

@Component({
  selector: 'bs-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
})
export class OperatorsComponent implements OnInit, OnDestroy {
  deleteDialogVisibility = false;
  hasChargePoints = false;
  isDeleteLoading = false;
  showDeletionStatusMessage = false;
  errorMessage = '';
  advancedSearchForm!: FormGroup<SearchFormControls>;
  appliedFilters: AppliedFilter[] = [];
  operators!: OperatorsTable | null;
  loadingOperators = false;
  tableTotalRecords = 0;
  searchDialogPosition: Position =
    REVERSED_POSITIONS[
      (this.translateService.currentLang ||
        this.translateService.defaultLang) as LanguageKey
    ];
  searchDialogVisibility = false;
  operatorsSubscription!: Subscription;
  selectedOperators: OperatorTable[] = [];
  advancedSearchSubmitted = false;
  actionItems!: MenuItem[];
  activeOperatorRow?: OperatorTable;
  operatorId: number | undefined = 0;
  selectedOperatorName: string[] = [];
  isOneOrMore = '';
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private router: Router,
    private messageService: MessageService,
    private operatorService: OperatorService,
    private bsTableService: BsTableService,
    private cdr: ChangeDetectorRef
  ) {}
  allTableColumns: Column[] = [];

  get advancedSearchCriteria() {
    return this.operatorService.transformAdvancedSearchObject(
      this.advancedSearchForm.value
    );
  }
  @Select(OperatorState.resolvedOperators)
  operators$!: Observable<ConvertedOperators>;

  ngOnInit(): void {
    this.actionItems = [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => {
          this.router.navigate([`/operators/${this.activeOperatorRow?.id}`]);
        },
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.router.navigate([
            `/operators/${this.activeOperatorRow?.id}/edit`,
          ]);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.operatorId = this.activeOperatorRow?.id;
          if (this.operatorId) {
            this.showDeleteDialog();
          }
        },
      },
      // {
      // label: 'Audit History Log',
      // icon: 'pi pi-history',
      // command: () => {},
      // },
    ];

    this.advancedSearchForm = new FormGroup(
      {
        name: new FormControl<string | null>(null),
        email: new FormControl<string | null>(null),
        phoneNumber: new FormControl<string | null>(null),
        landlineNumber: new FormControl<string | null>(null),
        address: new FormControl<string | null>(null),

        commercial_register_id: new FormControl<string | null>(null),
        commercial_issuance_office: new FormControl<string | null>(null),
        commercial_issuance_date: new FormControl<Date | null>(null),

        tax_register_id: new FormControl<string | null>(null),
        tax_issuance_office: new FormControl<string | null>(null),
        tax_issuance_date: new FormControl<Date | null>(null),

        electricity_register_id: new FormControl<string | null>(null),
        electricity_issuance_office: new FormControl<string | null>(null),
        electricity_issuance_date: new FormControl<Date | null>(null),

        subscription: new FormControl<string | null>(null),

        createdBy: new FormControl<User[] | null>(null),
        creationDate: new FormControl<Date | null>(null),
        // FIXME: both till dates needs to be after at date
        created_till_date: new FormControl<Date | null>(
          {
            value: null,
            disabled: true,
          },
          {
            validators: [dateNotBefore('creationDate')],
          }
        ),

        lastModifiedBy: new FormControl<User[] | null>(null),
        lastModifiedDate: new FormControl<Date | null>(null),
        updated_till_date: new FormControl<Date | null>(
          {
            value: null,
            disabled: true,
          },
          {
            validators: [dateNotBefore('lastModifiedDate')],
          }
        ),
      },
      {
        validators: [formHasValue()],
      }
    );

    this.generateTableColumns();
  }

  setActiveRow(operator: OperatorTable) {
    this.selectedOperatorName = [];
    this.activeOperatorRow = operator;
    this.selectedOperatorName.push(operator.name.value);
  }

  generateTableColumns() {
    this.allTableColumns = [
      { field: 'name', header: 'Name', notHidable: true },
      { field: 'address', header: 'Address' },
      { field: 'phoneNumber', header: 'Phone Number' },
      { field: 'email', header: 'E-mail Address' },
      { field: 'creationDate', header: 'Created At' },
      { field: 'createdBy', header: 'Created By', hidden: true },
      { field: 'lastModifiedBy', header: 'Updated By', hidden: true },
      { field: 'lastModifiedDate', header: 'Updated At' },
    ];
  }

  onAdvancedSearchShow() {
    if (this.appliedFilters.length) {
      this.appliedFilters.forEach(filter => {
        this.advancedSearchForm.controls[
          filter.key as keyof SearchFormControls
        ]?.setValue(filter.originalValue);
      });
    }

    if (this.advancedSearchForm.valid) {
      this.advancedSearchSubmitted = true;
    }
    if (this.advancedSearchForm.invalid) {
      this.advancedSearchSubmitted = false;
    }
  }

  filterTable() {
    this.tableComponent.filter();
  }

  getOperators(lazyLoadEvent: CustomTableLazyLoadEvent) {
    const paginationParams = {
      pageNum: lazyLoadEvent.pageNum || 0,
      pageSize: lazyLoadEvent.rows || ELEMENTS_PER_PAGE,
      sortBy: lazyLoadEvent.sortField,
      direction: getSortDirection(lazyLoadEvent.sortOrder?.toString()),
      searchCriteria: this.bsTableService.generateSearchCriteria(
        lazyLoadEvent.filters as object,
        this.advancedSearchCriteria || []
      ),
    };
    this.loadingOperators = true;
    this.cdr.detectChanges();
    this.operators = null;
    this.operatorsSubscription = this.store
      .dispatch(new PaginateOperators(paginationParams))
      .pipe(withLatestFrom(this.operators$))
      .subscribe({
        next: ([_, operators]) => {
          this.operators = this.operatorService.getOperatorsTable(operators);
          this.tableTotalRecords = operators.totalElements || 0;
          this.loadingOperators = false;
        },
        error: (error: ErrorResponse) => {
          this.loadingOperators = false;
        },
      });
  }

  onSelectedOperatorsChange(operators: typeof this.selectedOperators) {
    this.selectedOperators = operators;
  }

  openAdvancedSearch() {
    this.searchDialogVisibility = true;
  }

  getAppliedFilters(appliedFilters: AppliedFilter[]) {
    this.appliedFilters = appliedFilters;
  }

  onDeleteFilter(key: string) {
    this.appliedFilters = this.appliedFilters.filter(
      appliedFilter => appliedFilter.key !== key
    );
    this.advancedSearchForm.patchValue({
      [key]: null,
    });
  }

  onClose() {
    this.searchDialogVisibility = false;
  }
  showDeleteDialog() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'one';
  }
  showDeleteDialogForMore() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'more';
    this.selectedOperatorName = [];
    this.selectedOperatorName = this.selectedOperators?.map(
      operator => operator.name.value
    ) as string[];
  }
  hideDeleteDialog() {
    this.deleteDialogVisibility = false;
    this.hasChargePoints = false;
  }
  hideErrMsg() {
    this.hasChargePoints = false;
  }

  deleteOperators() {
    this.showDeletionStatusMessage = false;
    this.isDeleteLoading = true;
    let ids: number[] | undefined = [];
    if (this.isOneOrMore === 'one') {
      ids = [Number(this.operatorId)];
    } else if (this.isOneOrMore === 'more') {
      ids = this.selectedOperators?.map(operator => operator.id);
    }

    if (ids && !!ids.length) {
      this.store.dispatch(new DeleteOperators(ids)).subscribe({
        next: () => {
          this.deleteDialogVisibility = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Operator (s) Deleted',
            detail: `Operator (s) was deleted successfully.`,
          });
          this.isDeleteLoading = false;
          this.hasChargePoints = false;
          this.filterTable();
        },
        error: (error: ErrorResponse) => {
          this.isDeleteLoading = false;
          this.showDeletionStatusMessage = true;
          if (error.error.errorMessage == 'cpo has active charge point') {
            this.hasChargePoints = true;
          } else {
            this.errorMessage = getErrorMessage(error.error.errorCode);
          }
        },
      });
    }
  }
  ngOnDestroy(): void {
    this.operatorsSubscription.unsubscribe();
  }
}
