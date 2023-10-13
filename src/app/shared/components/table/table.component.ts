import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import {
  Table,
  TableFilterEvent,
  TableLazyLoadEvent,
  TableSelectAllChangeEvent,
} from 'primeng/table';
import { ELEMENTS_PER_PAGE } from 'src/app/core/api/api.model';
import { CustomTableLazyLoadEvent } from '../../shared.model';
import { AppliedFilter, Column, ToggleValue } from './table.model';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';

@Component({
  selector: 'bs-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  searchForm!: FormGroup;
  columnsEditorVisibility = false;
  pageNum = 0;
  lazyLoadedEvent: CustomTableLazyLoadEvent = {};

  private _selectedEntities: typeof this.entities = [];

  @Input() actionItems!: MenuItem[];
  @Input() entities: any = [];
  @Input() columns: Column[] = [];

  // @Input() advancedSearchForm!: FormGroup;
  @Input() totalRecords = 0;
  @Input() pageSize = +(localStorage.getItem('pageSize') || ELEMENTS_PER_PAGE);

  @Input() loading = false;
  @Input() deleteMode: 'delete' | 'archive' = 'delete';
  @Input() searchInput = 'name';
  @Input() appliedFilters: AppliedFilter[] = [];

  @ViewChild('table') table!: Table;

  @Output() loadPage = new EventEmitter<TableLazyLoadEvent>();
  @Output() selectedEntitiesChange = new EventEmitter<typeof this.entities>();
  @Output() emitDeletion = new EventEmitter<
    (deletionStatus: boolean | string) => void
  >();
  @Output() handleOpenAdvancedSearch = new EventEmitter();
  @Output() deleteFilterEmitter = new EventEmitter<string>();
  @Output() passActiveRow = new EventEmitter<any>();
  @Output() passToggleValue = new EventEmitter<ToggleValue>();

  selectedColumns: Column[] = [];
  defaultColumns: Column[] = [];
  checkedColumns: Column[] = [];

  get selectedEntities(): typeof this.entities {
    return this._selectedEntities;
  }

  set selectedEntities(entities: typeof this.entities) {
    this._selectedEntities = entities;
    this.selectedEntitiesChange.emit(entities);
  }

  get isAllSelected() {
    return this.selectedEntities?.length === this.entities.length;
  }

  ngOnInit(): void {
    this.selectedColumns = this.columns.filter(col => !col.hidden);
    this.checkedColumns = this.selectedColumns;
    this.defaultColumns = this.selectedColumns;
    this.searchForm = new FormGroup({
      [this.searchInput]: new FormControl(''),
    });
  }

  resetColumns() {
    this.checkedColumns = this.columns.filter(col => !col.hidden);
    this.selectedColumns = this.checkedColumns;
    this.defaultColumns = this.checkedColumns;
  }
  applyColumns() {
    this.selectedColumns = this.checkedColumns;
    this.columnsEditorVisibility = false;
  }

  // MAIN FUNCTION
  loadRecords(event: TableLazyLoadEvent) {
    this.lazyLoadedEvent = event;
    this.lazyLoadedEvent.pageNum = this.pageNum;
    this.loadPage.emit(this.lazyLoadedEvent);
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.lazyLoadedEvent.rows = event.rows;
      this.lazyLoadedEvent.first = event.first;
      this.lazyLoadedEvent.pageNum = this.pageNum;
      this.loadPage.emit(this.lazyLoadedEvent);
    }
  }

  onToggle({ checked }: InputSwitchOnChangeEvent, id: number) {
    console.log(`🚀 ~ TableComponent ~ onToggle ~ checked:`, checked);
    this.passToggleValue.emit({ checked, id });
  }

  submitFilterInput() {
    this.pageNum = 0;
    this.lazyLoadedEvent.pageNum = this.pageNum;
    this.filter();
  }

  onPageSizeChange(pageSize: number) {
    localStorage.setItem('pageSize', pageSize.toString());
    this.pageNum = 0;
    this.lazyLoadedEvent.pageNum = this.pageNum;
    this.lazyLoadedEvent.rows = pageSize;
    this.loadPage.emit(this.lazyLoadedEvent);
  }

  filter() {
    const searchText = this.searchForm.get(this.searchInput)?.value;
    this.table.filter(searchText, this.searchInput, 'in');
  }

  onFilter(event: TableFilterEvent) {
    // THis is the behavior right now, if we don't want that, we will need to implement custom filtration using this event and then assign the result to selectedEntities (it is not easy and would destroy built-in table filtration)
    this.selectedEntities = [];
  }

  openColumnsEditor() {
    this.columnsEditorVisibility = true;
  }

  deleteFilter(key: string) {
    this.deleteFilterEmitter.emit(key);
    this.loadPage.emit(this.lazyLoadedEvent);
  }

  openAdvancedSearch() {
    this.handleOpenAdvancedSearch.emit();
  }

  logEntities() {
    console.log(this.entities);
  }

  onSelectionChange(entities: typeof this.entities) {
    this.selectedEntities = entities;
  }

  onSelectAllChange(event: TableSelectAllChangeEvent) {
    const checked = event.checked;

    if (checked) {
      this.selectedEntities = this.entities;
    } else {
      this.selectedEntities = [];
    }
  }

  deleteSelected() {
    this.emitDeletion.emit();
  }

  emitActiveRow(entity: any) {
    this.passActiveRow.emit(entity);
  }
}
