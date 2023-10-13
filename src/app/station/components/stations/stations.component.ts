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
  AppliedFilter,
  Column,
} from 'src/app/shared/components/table/table.model';

import { MenuItem, MessageService } from 'primeng/api';
import { getErrorMessage, getSortDirection } from 'src/app/core/api/api-utils';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { BsTableService } from 'src/app/shared/services/table/table.service';
import { StationService } from '../../services/station.service';
import { ArchiveStations, PaginateStations } from '../../state/station.actions';
import { StationState } from '../../state/station.state';
import {
  ConvertedStations,
  SearchFormControls,
  Station,
  StationTable,
  StationsTable,
} from '../../station.model';
import {
  CustomTableLazyLoadEvent,
  Position,
} from 'src/app/shared/shared.model';
import { REVERSED_POSITIONS } from 'src/app/shared/utils/constants';
import { LanguageKey } from 'src/app/core/utils/core.types';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'bs-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit, OnDestroy {
  advancedSearchForm!: FormGroup<SearchFormControls>;
  searchForm!: FormGroup;
  appliedFilters: AppliedFilter[] = [];
  stations!: StationsTable | null;
  loadingStations = false;
  tableTotalRecords = 0;
  searchDialogPosition: Position =
    REVERSED_POSITIONS[
      (this.translateService.currentLang ||
        this.translateService.defaultLang) as LanguageKey
    ];
  searchDialogVisibility = false;
  stationsSubscription!: Subscription;
  archiveStationsSubscription!: Subscription;
  selectedStations!: StationTable[];
  advancedSearchSubmitted = false;
  actionItems!: MenuItem[];
  activeStationRow: Station | null | StationTable = null;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  stationId: number | undefined = 0;
  isOneOrMore = 'one';
  deleteDialogVisibility = false;
  isDeleteLoading = false;
  hasChargePoints = false;
  showDeletionStatusMessage = false;
  errorMessage = '';
  selectedStationsName: string[] = [];

  constructor(
    private translateService: TranslateService,
    private messageService: MessageService,
    private store: Store,
    private router: Router,
    private stationService: StationService,
    private bsTableService: BsTableService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      address: [''],
      locationAccessType: [''],
      country: [null],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      amenities: [''],
      createdBy: [''],
      creationDate: [''],
      creationDateTo: [{ value: null, disabled: true }],
      lastModifiedBy: [''],
      lastModifiedDate: [''],
      lastModifiedDateTo: [{ value: null, disabled: true }],
    });
  }
  allTableColumns: Column[] = [];

  get advancedSearchCriteria() {
    return this.stationService.transformAdvancedSearchObject(
      this.searchForm.value
    );
  }
  @Select(StationState.resolvedStations)
  stations$!: Observable<ConvertedStations>;

  ngOnInit(): void {
    this.actionItems = [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => {
          this.router.navigate([`/stations/${this.activeStationRow?.id}`]);
        },
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.router.navigate([`/stations/${this.activeStationRow?.id}/edit`]);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.stationId = this.activeStationRow?.id;
          if (this.stationId) {
            this.openDeleteStation();
          }
        },
      },
      // {
      // label: 'Audit History Log',
      // icon: 'pi pi-history',
      // command: () => {},
      // },
    ];

    this.generateTableColumns();
  }

  setActiveRow(station: StationTable) {
    this.selectedStationsName = [];
    this.activeStationRow = station;
    this.selectedStationsName.push(station.name.value);
  }

  generateTableColumns() {
    this.allTableColumns = [
      { field: 'name', header: 'Name', notHidable: true },
      { field: 'city', header: 'City' },
      { field: 'state', header: 'State/Province' },
      { field: 'numberOfChargePoints', header: 'Number of Charge Points' },
      { field: 'verified', header: 'Verification' },
      { field: 'creationDate', header: 'Created At', hidden: true },
      { field: 'createdBy', header: 'Created By', hidden: true },
      { field: 'lastModifiedBy', header: 'Updated By', hidden: true },
      { field: 'lastModifiedDate', header: 'Updated At', hidden: true },
    ];
  }

  onAdvancedSearchShow() {
    if (this.appliedFilters.length) {
      this.appliedFilters.forEach(filter => {
        this.searchForm.controls[
          filter.key as keyof SearchFormControls
        ]?.setValue(filter.originalValue);
      });
    }

    if (this.searchForm.valid) {
      this.advancedSearchSubmitted = true;
    }
    if (this.searchForm.invalid) {
      this.advancedSearchSubmitted = false;
    }
  }

  filterTable() {
    this.tableComponent.filter();
  }

  getStations(lazyLoadEvent: CustomTableLazyLoadEvent) {
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

    this.loadingStations = true;
    this.cdr.detectChanges();
    this.stations = null;

    this.stationsSubscription = this.store
      .dispatch(new PaginateStations(paginationParams))
      .pipe(withLatestFrom(this.stations$))
      .subscribe({
        next: ([_, stations]) => {
          this.stations = this.stationService.getStationsTable(stations);
          this.tableTotalRecords = stations.totalElements || 0;
          this.loadingStations = false;
        },
        error: () => {
          this.loadingStations = false;
        },
      });
  }

  onSelectedStationsChange(stations: typeof this.selectedStations) {
    this.selectedStations = stations;
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
    this.searchForm.patchValue({
      [key]: null,
    });
  }

  onClose() {
    this.searchDialogVisibility = false;
  }
  openDeleteStation() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'one';
  }
  showDeleteDialogForMore() {
    this.deleteDialogVisibility = true;
    this.isOneOrMore = 'more';
    this.selectedStationsName = [];
    this.selectedStationsName = this.selectedStations?.map(
      station => station.name.value
    );
  }

  deleteStations() {
    this.showDeletionStatusMessage = false;
    this.isDeleteLoading = true;
    let ids: number[] | undefined = [];
    if (this.isOneOrMore === 'one') {
      ids = [Number(this.stationId)];
    } else if (this.isOneOrMore === 'more') {
      ids = this.selectedStations?.map(station => station.id);
    }

    if (ids && !!ids.length) {
      this.archiveStationsSubscription = this.store
        .dispatch(new ArchiveStations(ids))
        .subscribe({
          next: () => {
            this.deleteDialogVisibility = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Station(s) Deleted',
              detail: `station(s) was deleted successfully.`,
            });
            this.isDeleteLoading = false;
            this.hasChargePoints = false;
            this.filterTable();
          },
          error: (error: ErrorResponse) => {
            this.isDeleteLoading = false;
            this.showDeletionStatusMessage = true;
            if (
              error.error.errorMessage ==
              'one of the stations has active charge points'
            ) {
              this.hasChargePoints = true;
            } else {
              this.errorMessage = getErrorMessage(error.error.errorCode);
            }
          },
        });
    }
  }

  hideErrMsg() {
    this.hasChargePoints = false;
  }
  hideDeleteDialog() {
    this.deleteDialogVisibility = false;
    this.hasChargePoints = false;
  }

  ngOnDestroy(): void {
    this.stationsSubscription.unsubscribe();
  }
}
