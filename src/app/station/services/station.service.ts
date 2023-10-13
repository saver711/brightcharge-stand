import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ELEMENTS_PER_PAGE,
  PaginationParams,
  SearchCriteria,
} from 'src/app/core/api/api.model';
import {
  AppliedFilter,
  TableDataTypes,
} from 'src/app/shared/components/table/table.model';
import {
  BEStation,
  ConvertedStations,
  StationTable,
  StationsResponse,
  StationsTable,
} from '../station.model';
import { formatDateToUS } from 'src/app/core/utils/date-formatter';
import { City, Country, State } from '@shared/models/location.model';
import { StationCreationPayload } from '@station/models/station-creation-payload.model';
import { formatDate } from '@angular/common';
import { User } from 'src/app/user/user.model';
import { Amenities } from '@station/models/amenity.enum';
import { LocationAccessTypes } from '@station/models/location-access-type.enum';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  constructor(private http: HttpClient) {}

  fetchStations() {
    return this.http.get<StationsResponse>(`/api/backoffice/locations`);
  }
  paginateStations({
    pageNum,
    pageSize,
    sortBy,
    direction,
    searchCriteria,
  }: PaginationParams) {
    let url = `/api/backoffice/locations?pageNum=${pageNum}&pageSize=${
      pageSize || ELEMENTS_PER_PAGE
    }`;
    if (searchCriteria) {
      url = `/api/backoffice/locations/search?pageNum=${pageNum}&pageSize=${
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
      return this.http.post<StationsResponse>(url, searchCriteria);
    }
    return this.http.get<StationsResponse>(url);
  }
  getStationById(id: number) {
    return this.http.get<BEStation>(`/api/backoffice/locations/${id}`);
  }
  searchStations(searchCriteria: SearchCriteria[]) {
    return this.http.post<StationsResponse>(
      `/api/backoffice/locations/search`,
      searchCriteria
    );
  }
  archiveStations(ids: number[]) {
    return this.http.delete('/api/backoffice/locations', { body: ids });
  }

  getStationsTable(resolvedStations: ConvertedStations): StationsTable {
    const stations: StationTable[] = resolvedStations.content.map(station => ({
      ...station,
      id: station.id,
      name: {
        type: TableDataTypes.TEXT,
        value: station.name,
      },
      city: {
        type: TableDataTypes.TEXT,
        value: station.city,
      },
      state: {
        type: TableDataTypes.TEXT,
        value: station.state,
      },
      numberOfChargePoints: {
        type: TableDataTypes.HIGHLIGHTED,
        value: station.numberOfChargePoints,
      },
      verified: {
        type: TableDataTypes.BOOLEAN,
        value: station.verified,
      },
      createdBy: {
        type: TableDataTypes.HIGHLIGHTED,
        value: station.createdBy,
      },
      lastModifiedBy: {
        type: TableDataTypes.HIGHLIGHTED,
        value: station.lastModifiedBy,
      },
      creationDate: {
        type: TableDataTypes.TEXT,
        value: formatDateToUS(station.creationDate)!,
      },
      lastModifiedDate: {
        type: TableDataTypes.TEXT,
        value: formatDateToUS(station.lastModifiedDate)!,
      },
    }));

    return { ...resolvedStations, content: stations };
  }

  getCounties() {
    return this.http.get<Country[]>('/api/backoffice/locations/countries');
  }

  getCities(countryId: number) {
    return this.http.get<City[]>(
      `/api/backoffice/locations/cities/${countryId}`
    );
  }

  getCityStates(cityId: number) {
    return this.http.get<State[]>(`/api/backoffice/locations/states/${cityId}`);
  }

  createStation(stationCreationPayload: StationCreationPayload) {
    return this.http.post<void>(
      '/api/backoffice/locations',
      stationCreationPayload
    );
  }

  getTableAppliedFilters(input: any): AppliedFilter[] {
    const formattedArray: AppliedFilter[] = [];

    for (const key in input) {
      if (input.hasOwnProperty(key) && input[key]) {
        let formattedValue = input[key];
        const originalValue = input[key];
        let title = key;

        switch (key) {
          case 'name':
            title = 'Name';
            break;
          case 'address':
            title = 'Address';
            break;
          case 'country':
            title = 'Country';
            break;
          case 'locationAccessType':
            title = 'Accessibility';
            break;
          case 'state':
            title = 'State';
            break;
          case 'amenities':
            title = 'Amenities';
            break;
          case 'createdBy':
            title = 'Created By';
            break;
          case 'lastModifiedBy':
            title = 'Updated By';
            break;
          case 'creationDate':
            title = 'Created At (From)';
            break;
          case 'creationDateTo':
            title = 'Created At (To)';
            break;
          case 'lastModifiedDate':
            title = 'Updated At';
            break;
          case 'lastModifiedDateTo':
            title = 'Updated At (To)';
            break;
          default:
            // No special formatting for other keys
            break;
        }
        if (key === 'locationAccessType') {
          formattedValue = LocationAccessTypes[formattedValue];
        }
        if (key === 'amenities') {
          formattedValue = formattedValue
            .map((item: string) => Amenities[item])
            .join(', ');
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
  transformAdvancedSearchObject(searchObject: { [key: string]: any }) {
    const result = [];
    for (const key in searchObject) {
      let value = searchObject[key];
      const objectKey = key;
      if (value) {
        if (
          objectKey === 'lastModifiedDateTo' ||
          objectKey === 'creationDateTo'
        ) {
          continue;
        }
        let filterValue;
        if (objectKey === 'creationDate') {
          filterValue = searchObject['creationDateTo'];
        }
        if (objectKey === 'lastModifiedDate') {
          filterValue = searchObject['lastModifiedDateTo'];
        }
        if (objectKey === 'createdBy' || objectKey === 'lastModifiedBy') {
          const usernames = (value as User[])
            .map(user => user.username)
            .join(',');
          value = usernames;
        }
        if (objectKey === 'amenities') {
          const amenities = (value as string[]).map(user => user).join(',');
          value = amenities;
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
}
