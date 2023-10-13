import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ELEMENTS_PER_PAGE,
  PaginationParams,
  SearchCriteria,
} from 'src/app/core/api/api.model';
import {
  dateToDataTime,
  formatDateToUS,
} from 'src/app/core/utils/date-formatter';
import { TableDataTypes } from 'src/app/shared/components/table/table.model';
import {
  BEChargePoint,
  ChargePointTable,
  ChargePointsResponse,
  ChargePointsTable,
  ConnectorType,
  ConvertedChargePoints,
} from '../charge-point.model';

@Injectable({
  providedIn: 'root',
})
export class ChargePointService {
  constructor(private http: HttpClient) {}

  fetchChargePoints() {
    return this.http.get<ChargePointsResponse>(`/api/backoffice/chargePoint`);
  }
  paginateChargePoints({
    pageNum,
    pageSize,
    sortBy,
    direction,
    searchCriteria,
  }: PaginationParams) {
    let url = `/api/backoffice/chargePoint?pageNum=${pageNum}&pageSize=${
      pageSize || ELEMENTS_PER_PAGE
    }`;
    if (searchCriteria) {
      url = `/api/backoffice/chargePoint/search?pageNum=${pageNum}&pageSize=${
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
      return this.http.post<ChargePointsResponse>(url, searchCriteria);
    }
    return this.http.get<ChargePointsResponse>(url);
  }
  getChargePointById(id: number) {
    return this.http.get<BEChargePoint>(`/api/backoffice/chargePoint/${id}`);
  }
  searchChargePoints(searchCriteria: SearchCriteria[]) {
    return this.http.post<ChargePointsResponse>(
      `/api/backoffice/chargePoint/search`,
      searchCriteria
    );
  }
  deleteChargePoints(ids: number[]) {
    return this.http.delete('/api/backoffice/chargePoint', { body: ids });
  }

  getChargePointsTable(
    resolvedChargePoints: ConvertedChargePoints
  ): ChargePointsTable {
    const chargePoints: ChargePointTable[] = resolvedChargePoints.content.map(
      chargePoint => ({
        ...chargePoint,
        id: chargePoint.id,
        name: {
          type: TableDataTypes.TEXT,
          value: chargePoint.name,
        },
        station: {
          type: TableDataTypes.LINK,
          value: `/stations/${chargePoint.location.id}`,
          text: chargePoint.location.name,
        },
        operator: {
          type: TableDataTypes.IMAGE_WITH_LINK,
          value: `/operators/${chargePoint.cpo.id}`,
          text: chargePoint.cpo.name,
          image: chargePoint.cpo.logoUrl,
        },
        connectors: {
          type: TableDataTypes.MULTI_DOTS_WITH_LINK,
          value: chargePoint.connectors.map(connector => {
            return {
              status: connector.status.toLowerCase(),
              url: `/connectors/${connector.id}`,
              text: connector.qrCode,
              placeholder: `(${this.mapConnectorType(
                connector.connectorType
              )} ${connector.circuitType})`,
            };
          }),
        },
        lastHeartBeat: {
          type: TableDataTypes.DATE_TIME,
          value: dateToDataTime(chargePoint.lastHeartBeat),
        },
        connectivity: {
          type: TableDataTypes.BOOLEAN,
          value: chargePoint.connected,
        },
        verified: {
          type: TableDataTypes.BOOLEAN,
          value: chargePoint.verified,
        },
        status: {
          type: TableDataTypes.STATUS,
          value: chargePoint.status,
        },
        enabled: {
          type: TableDataTypes.TOGGLE,
          value: chargePoint.enabled,
        },
        createdBy: {
          type: TableDataTypes.HIGHLIGHTED,
          value: chargePoint.createdBy,
        },
        lastModifiedBy: {
          type: TableDataTypes.HIGHLIGHTED,
          value: chargePoint.lastModifiedBy,
        },
        creationDate: {
          type: TableDataTypes.TEXT,
          value: formatDateToUS(chargePoint.creationDate)!,
        },
        lastModifiedDate: {
          type: TableDataTypes.TEXT,
          value: formatDateToUS(chargePoint.lastModifiedDate)!,
        },
      })
    );

    return { ...resolvedChargePoints, content: chargePoints };
  }

  mapConnectorType(type: ConnectorType) {
    const finalType = {
      CCS2: 'CCS 2',
      CHADEMO: 'ChadeMO',
      GBTDC: 'GB/T',
      J1772: 'J1772',
      TYPE2: 'Type2',
      TYPE3: 'Type3',
    }[type];

    return finalType;
  }

  toggleChargePoint(id: number) {
    return this.http.patch(`/api/backoffice/chargePoint/toggle/${id}`, {});
  }
}
