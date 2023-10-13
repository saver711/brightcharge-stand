import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, withLatestFrom } from 'rxjs';
import { ELEMENTS_PER_PAGE, ErrorResponse } from 'src/app/core/api/api.model';
import {
  Column,
  ToggleValue,
} from 'src/app/shared/components/table/table.model';

import { MenuItem, MessageService } from 'primeng/api';
import { getErrorMessage, getSortDirection } from 'src/app/core/api/api-utils';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { BsTableService } from 'src/app/shared/services/table/table.service';
import { CustomTableLazyLoadEvent } from 'src/app/shared/shared.model';
import {
  ChargePointTable,
  ChargePointsTable,
  ConvertedChargePoints,
} from '../../charge-point.model';
import { ChargePointService } from '../../services/charge-point.service';
import {
  PaginateChargePoints,
  deleteChargePoints,
} from '../../state/charge-point.actions';
import { ChargePointState } from '../../state/charge-point.state';
@Component({
  selector: 'bs-charge-points',
  templateUrl: './charge-points.component.html',
  styleUrls: ['./charge-points.component.scss'],
})
export class ChargePointsComponent implements OnInit, OnDestroy {
  deleteDialogVisibility = false;
  isDeleteLoading = false;
  showDeletionStatusMessage = false;
  errorMessage = '';
  isOneOrMore = '';
  selectedChargePointsNames: string[] = [];
  chPointId: number | undefined;
  // advancedSearchForm!: FormGroup<chargePointsSearchFormControls>;
  // advancedSearchCriteria!: any;
  // appliedFilters: AppliedFilter[] = [];
  chargePoints!: ChargePointsTable | null;
  loadingChargePoints = false;
  tableTotalRecords = 0;
  // searchDialogPosition: Position =
  //   REVERSED_POSITIONS[
  //     (this.translateService.currentLang ||
  //       this.translateService.defaultLang) as LanguageKey
  //   ];
  // searchDialogVisibility = false;
  chargePointsSubscription!: Subscription;
  selectedChargePoints!: ChargePointTable[] | null;
  // advancedSearchSubmitted = false;
  actionItems!: MenuItem[];
  activeChargePointRow: ChargePointTable | null = null;
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private router: Router,
    private chargePointService: ChargePointService,
    private bsTableService: BsTableService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}
  allTableColumns: Column[] = [];

  // get advancedSearchCriteria() {
  //   return this.chargePointService.transformAdvancedSearchObject(
  //     this.advancedSearchForm.value
  //   );
  // }
  @Select(ChargePointState.resolvedChargePoints)
  chargePoints$!: Observable<ConvertedChargePoints>;

  ngOnInit(): void {
    this.actionItems = [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => {
          this.router.navigate([
            `/charge-points/${this.activeChargePointRow?.id}`,
          ]);
        },
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.router.navigate([
            `/charge-points/${this.activeChargePointRow?.id}/edit`,
          ]);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.chPointId = this.activeChargePointRow?.id;
          if (this.chPointId) {
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

    // this.advancedSearchForm = new FormGroup(
    //   {
    //     name: new FormControl<string | null>(null),
    //     email: new FormControl<string | null>(null),
    //     phoneNumber: new FormControl<string | null>(null),
    //     landlineNumber: new FormControl<string | null>(null),
    //     address: new FormControl<string | null>(null),

    //     commercial_register_id: new FormControl<string | null>(null),
    //     commercial_issuance_office: new FormControl<string | null>(null),
    //     commercial_issuance_date: new FormControl<Date | null>(null),

    //     tax_register_id: new FormControl<string | null>(null),
    //     tax_issuance_office: new FormControl<string | null>(null),
    //     tax_issuance_date: new FormControl<Date | null>(null),

    //     electricity_register_id: new FormControl<string | null>(null),
    //     electricity_issuance_office: new FormControl<string | null>(null),
    //     electricity_issuance_date: new FormControl<Date | null>(null),

    //     subscription: new FormControl<string | null>(null),

    //     createdBy: new FormControl<User[] | null>(null),
    //     creationDate: new FormControl<Date | null>(null),
    //     // FIXME: both till dates needs to be after at date
    //     created_till_date: new FormControl<Date | null>(
    //       {
    //         value: null,
    //         disabled: true,
    //       },
    //       {
    //         validators: [dateNotBefore('creationDate')],
    //       }
    //     ),

    //     lastModifiedBy: new FormControl<User[] | null>(null),
    //     lastModifiedDate: new FormControl<Date | null>(null),
    //     updated_till_date: new FormControl<Date | null>(
    //       {
    //         value: null,
    //         disabled: true,
    //       },
    //       {
    //         validators: [dateNotBefore('lastModifiedDate')],
    //       }
    //     ),
    //   },
    //   {
    //     validators: [formHasValue()],
    //   }
    // );

    this.generateTableColumns();
  }

  setActiveRow(chargePoint: ChargePointTable) {
    this.selectedChargePointsNames = [];
    this.activeChargePointRow = chargePoint;
    this.selectedChargePointsNames.push(chargePoint.name.value);
  }

  generateTableColumns() {
    this.allTableColumns = [
      { field: 'name', header: 'Name', notHidable: true },
      { field: 'station', header: 'Station' },
      { field: 'operator', header: 'Operator' }, // with img
      { field: 'connectors', header: 'Connectors' }, // arr
      { field: 'lastHeartBeat', header: 'Last Heartbeat' }, // date, time
      { field: 'connectivity', header: 'Connectivity' },
      { field: 'verified', header: 'Verification' },
      { field: 'status', header: 'Availability' }, // rounded highlight
      { field: 'enabled', header: 'Enabled' }, // toggle

      { field: 'creationDate', header: 'Created At', hidden: true },
      { field: 'createdBy', header: 'Created By', hidden: true },
      { field: 'lastModifiedBy', header: 'Updated By', hidden: true },
      { field: 'lastModifiedDate', header: 'Updated At', hidden: true },
    ];
  }

  // onAdvancedSearchShow() {
  //   if (this.appliedFilters.length > 1) {
  //     this.appliedFilters.forEach(filter => {
  //       this.advancedSearchForm.controls[
  //         filter.key as keyof SearchFormControls
  //       ]?.setValue(filter.originalValue);
  //     });
  //   }

  //   if (this.advancedSearchForm.valid) {
  //     this.advancedSearchSubmitted = true;
  //   }
  //   if (this.advancedSearchForm.invalid) {
  //     this.advancedSearchSubmitted = false;
  //   }
  // }

  filterTable() {
    this.tableComponent.filter();
  }

  getChargePoints(lazyLoadEvent: CustomTableLazyLoadEvent) {
    this.loadingChargePoints = true;
    this.cdr.detectChanges();
    const paginationParams = {
      pageNum: lazyLoadEvent.pageNum || 0,
      pageSize: lazyLoadEvent.rows || ELEMENTS_PER_PAGE,
      sortBy: lazyLoadEvent.sortField,
      direction: getSortDirection(lazyLoadEvent.sortOrder?.toString()),
      searchCriteria: this.bsTableService.generateSearchCriteria(
        lazyLoadEvent.filters as object,
        // this.advancedSearchCriteria ||
        []
      ),
    };

    this.chargePoints = null;
    this.chargePointsSubscription = this.store
      .dispatch(new PaginateChargePoints(paginationParams))
      .pipe(withLatestFrom(this.chargePoints$))
      .subscribe({
        next: ([_, chargePoints]) => {
          this.chargePoints =
            this.chargePointService.getChargePointsTable(chargePoints);
          this.tableTotalRecords = chargePoints.totalElements || 0;
          this.loadingChargePoints = false;
        },
        error: (error: ErrorResponse) => {
          this.loadingChargePoints = false;
        },
      });
  }

  onSelectedChargePointsChange(chargePoints: typeof this.selectedChargePoints) {
    this.selectedChargePoints = chargePoints;
  }

  toggleChargePoint({ id }: ToggleValue) {
    this.chargePointService.toggleChargePoint(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Charge point toggled',
          detail: `charge point was toggled successfully.`,
        });
      },
      error: (error: ErrorResponse) => {
        const detail = getErrorMessage(error.error.errorCode);
        this.messageService.add({
          severity: 'error',
          summary: "Couldn't toggle it",
          detail,
        });
        this.filterTable();
      },
    });
  }

  // openAdvancedSearch() {
  //   this.searchDialogVisibility = true;
  // }

  // getAppliedFilters(appliedFilters: AppliedFilter[]) {
  //   this.appliedFilters = appliedFilters;
  // }

  // onDeleteFilter(key: string) {
  //   this.appliedFilters = this.appliedFilters.filter(
  //     appliedFilter => appliedFilter.key !== key
  //   );
  // this.advancedSearchForm.patchValue({
  //   [key]: null,
  // });
  // }

  // onClose() {
  //   this.searchDialogVisibility = false;
  // }
  showDeleteDialog() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'one';
  }
  hideDeleteDialog() {
    this.deleteDialogVisibility = false;
    this.errorMessage = '';
    this.showDeletionStatusMessage = false;
  }
  showDeleteDialogForMore() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'more';
    this.selectedChargePointsNames = [];
    this.selectedChargePointsNames = this.selectedChargePoints?.map(
      chargePoint => chargePoint.name.value
    ) as string[];
  }

  deleteChargePoints() {
    this.showDeletionStatusMessage = false;
    this.isDeleteLoading = true;
    let ids: number[] | undefined = [];
    if (this.isOneOrMore === 'one' && this.chPointId) {
      ids = [+this.chPointId];
    } else if (this.isOneOrMore === 'more') {
      ids = this.selectedChargePoints?.map(chPoint => chPoint.id);
    }

    if (ids && !!ids.length) {
      this.store.dispatch(new deleteChargePoints(ids)).subscribe({
        next: () => {
          this.deleteDialogVisibility = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Charge point (s) Deleted',
            detail: `charge point (s) was deleted successfully.`,
          });
          this.isDeleteLoading = false;
          this.filterTable();
        },
        error: (error: ErrorResponse) => {
          this.isDeleteLoading = false;
          this.showDeletionStatusMessage = true;
          this.errorMessage = getErrorMessage(
            error.error.errorCode,
            this.selectedChargePointsNames.length > 1
          );
        },
      });
    }
  }

  // deleteChargePoint(id: number) {
  // NOTE: Same
  //   this.deleteChargePointsSubscription = this.store
  //     .dispatch(new deleteChargePoints([id]))
  //     .subscribe({
  //       next: () => {
  //         console.log('deleted');
  //         this.filterTable();
  //       },
  //       error: (error: ErrorResponse) => {
  //         const msg = getErrorMessage(error.error.errorCode);
  //       },
  //     });
  // }

  ngOnDestroy(): void {
    this.chargePointsSubscription.unsubscribe();
  }
}
