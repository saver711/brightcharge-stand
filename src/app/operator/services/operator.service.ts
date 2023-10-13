/* eslint-disable no-prototype-builtins */
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ELEMENTS_PER_PAGE,
  PaginationParams,
  SearchCriteria,
} from 'src/app/core/api/api.model';
import { consistFormData } from 'src/app/core/utils/form-data.function';
import {
  AppliedFilter,
  TableDataTypes,
} from 'src/app/shared/components/table/table.model';
import { User } from 'src/app/user/user.model';
import {
  BEOperator,
  ConvertedOperators,
  CreateOperatorData,
  EditOperatorData,
  OperatorTable,
  OperatorsResponse,
  OperatorsTable,
} from '../operator.model';
import { formatDateToUS } from 'src/app/core/utils/date-formatter';

@Injectable({
  providedIn: 'root',
})
export class OperatorService {
  constructor(private http: HttpClient) {}

  createOperator(createData: CreateOperatorData) {
    return this.http.post<number>(
      `/api/backoffice/cpo`,
      consistFormData(createData)
    );
  }
  editOperator(editData: EditOperatorData) {
    return this.http.put<number>(
      `/api/backoffice/cpo`,
      consistFormData(editData)
    );
  }

  fetchOperators() {
    return this.http.get<OperatorsResponse>(`/api/backoffice/cpo`);
  }
  paginateOperators({
    pageNum,
    pageSize,
    sortBy,
    direction,
    searchCriteria,
  }: PaginationParams) {
    let url = `/api/backoffice/cpo?pageNum=${pageNum}&pageSize=${
      pageSize || ELEMENTS_PER_PAGE
    }`;
    if (searchCriteria) {
      url = `/api/backoffice/cpo/search?pageNum=${pageNum}&pageSize=${
        pageSize || ELEMENTS_PER_PAGE
      }`;
    }

    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (direction) {
      url += `&direction=${direction}`;
    }
    if (searchCriteria) {
      return this.http.post<OperatorsResponse>(url, searchCriteria);
    }
    return this.http.get<OperatorsResponse>(url);
  }
  getOperatorById(id: number) {
    return this.http.get<BEOperator>(`/api/backoffice/cpo/${id}`);
  }
  searchOperators(searchCriteria: SearchCriteria[]) {
    return this.http.post<OperatorsResponse>(
      `/api/backoffice/cpo/search`,
      searchCriteria
    );
  }
  deleteOperators(ids: number[]) {
    return this.http.delete('/api/backoffice/cpo', { body: ids });
  }

  transformAdvancedSearchObject(searchObject: { [key: string]: any }) {
    const result = [];
    const docsIds = [
      'commercial_register_id',
      'tax_register_id',
      'electricity_register_id',
    ];
    const docsOffices = [
      'commercial_issuance_office',
      'tax_issuance_office',
      'electricity_issuance_office',
    ];
    const docsDates = [
      'commercial_issuance_date',
      'tax_issuance_date',
      'electricity_issuance_date',
    ];
    for (const key in searchObject) {
      let value = searchObject[key];
      let objectKey = key;
      if (value) {
        // FIXME: Will remove subscription
        if (objectKey.includes('till') || objectKey === 'subscription') {
          continue;
        }

        let filterValue;
        if (objectKey.includes('commercial_')) {
          filterValue = 'COMMERCIAL_REGISTER';
        }
        if (objectKey.includes('electricity_')) {
          filterValue = 'ELECTRICITY_RETAIL_LICENSE';
        }
        if (objectKey.includes('tax_')) {
          filterValue = 'TAX_REGISTER';
        }
        if (objectKey === 'creationDate') {
          filterValue = searchObject['created_till_date'];
        }
        if (objectKey === 'lastModifiedDate') {
          filterValue = searchObject['updated_till_date'];
        }
        if (docsIds.includes(objectKey)) {
          objectKey = 'documentId';
        }
        if (docsOffices.includes(objectKey)) {
          objectKey = 'issuanceOffice';
        }
        if (docsDates.includes(objectKey)) {
          objectKey = 'issuanceDate';
        }
        if (objectKey === 'createdBy' || objectKey === 'lastModifiedBy') {
          const usernames = (value as User[])
            .map(user => user.username)
            .join(',');
          value = usernames;
        }

        value =
          typeof value === 'object'
            ? formatDate(value as Date, 'dd/MM/yyyy', 'en')
            : value;
        filterValue =
          typeof filterValue === 'object' && filterValue !== null
            ? formatDate(filterValue as Date, 'dd/MM/yyyy', 'en')
            : filterValue;

        result.push({
          filterKey: objectKey,
          value,
          ...(filterValue && {
            filterValue,
          }),
        });
      }
    }

    return result;
  }

  getTableAppliedFilters(input: any): AppliedFilter[] {
    const formattedArray: AppliedFilter[] = [];

    for (const key in input) {
      if (input.hasOwnProperty(key) && input[key]) {
        let formattedValue = input[key];
        const originalValue = input[key];
        let title = key;

        switch (key) {
          case 'phoneNumber':
            title = 'Phone Number';
            break;
          case 'landlineNumber':
            title = 'Landline Number';
            break;
          case 'commercial_register_id':
            title = 'Commercial Register Id';
            break;
          case 'commercial_issuance_date':
            title = 'Commercial Issuance Date';
            // formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
            break;
          case 'commercial_issuance_office':
            title = 'Commercial Issuance Office';
            break;
          case 'tax_register_id':
            title = 'Tax Register Id';
            break;
          case 'tax_issuance_date':
            title = 'Tax Issuance Date';
            // formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
            break;
          case 'tax_issuance_office':
            title = 'Tax Issuance Office';
            break;
          case 'electricity_register_id':
            title = 'Electricity Register Id';
            break;
          case 'electricity_issuance_date':
            title = 'Electricity Issuance Date';
            // formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
            break;
          case 'electricity_issuance_office':
            title = 'Electricity Issuance Office';
            break;
          case 'createdBy':
            title = 'Created By';
            // formattedValue = this.getUserNames(formattedValue);
            break;
          case 'lastModifiedBy':
            title = 'Updated By';
            // formattedValue = this.getUserNames(formattedValue);
            break;
          case 'creationDate':
            title = 'Created At';
            // formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
            break;
          case 'created_till_date':
            title = 'Created Till';
            break;
          case 'lastModifiedDate':
            title = 'Updated At';
            // formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
            break;
          case 'updated_till_date':
            title = 'Updated Till';
            break;
          case 'subscription':
            continue; // Ignore the "subscription" key
          default:
            // No special formatting for other keys
            break;
        }

        if (Array.isArray(formattedValue)) {
          formattedValue = formattedValue
            .map((item: User) => item.username)
            .join(', ');
        }

        if (formattedValue instanceof Date) {
          formattedValue = formatDate(formattedValue, 'dd/MM/yyyy', 'en');
        }

        formattedArray.push({
          key,
          value: formattedValue,
          title,
          originalValue,
        });
      }
    }

    return formattedArray;
  }

  getOperatorsTable(resolvedOperators: ConvertedOperators): OperatorsTable {
    const operators: OperatorTable[] = (
      resolvedOperators.content as BEOperator[]
    ).map(operator => ({
      ...operator,
      id: operator.id,
      name: {
        type: TableDataTypes.IMAGE_WITH_TEXT,
        value: operator.name,
        image: operator.logoUrl,
      },
      address: {
        type: TableDataTypes.TEXT,
        value: operator.address,
      },
      phoneNumber: {
        type: TableDataTypes.TEXT,
        value: operator.phoneNumber
          ? `(+20) ${operator.phoneNumber.substring(
              operator.phoneNumber.length - 10
            )}`
          : operator.phoneNumber,
      },
      landlineNumber: {
        type: TableDataTypes.TEXT,
        value: operator.landlineNumber,
      },
      email: {
        type: TableDataTypes.TEXT,
        value: operator.email,
      },
      creationDate: {
        type: TableDataTypes.TEXT,
        // FIXME: REMEMBER TO REMOVE (!) EVERYWHERE, AND REMOVE IF ELSE FROM formatDateToUS FUNCTION BECAUSE THE DATE SHOULDN'T BE RECEIVED AS NULL FROM BE
        value: formatDateToUS(operator.creationDate)!,
      },
      lastModifiedDate: {
        type: TableDataTypes.TEXT,
        value: formatDateToUS(operator.lastModifiedDate)!,
      },
      createdBy: {
        type: TableDataTypes.HIGHLIGHTED,
        value: operator.createdBy,
      },
      lastModifiedBy: {
        type: TableDataTypes.HIGHLIGHTED,
        value: operator.lastModifiedBy,
      },
    }));

    return { ...resolvedOperators, content: operators };
  }
}
