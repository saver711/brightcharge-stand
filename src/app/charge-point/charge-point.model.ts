import {
  Access,
  AuditData,
  PaginationProps,
  Status,
} from '../core/api/api.model';
import { TableDataTypes } from '../shared/components/table/table.model';
import { Station } from '../station/station.model';
export enum CircuitType {
  AC = 'AC',
  DC = 'DC',
}
export enum ConnectorType {
  CCS2 = 'CCS2',
  CHADEMO = 'CHADEMO',
  GBTDC = 'GBTDC',
  J1772 = 'J1772',
  TYPE2 = 'TYPE2',
  TYPE3 = 'TYPE3',
}
export enum ConnectorFormat {
  CABLE = 'CABLE',
  SOCKET = 'SOCKET',
}
export enum ConnectorStatus {
  AVAILABLE = 'AVAILABLE',
  PREPARING = 'PREPARING',
  CHARGING = 'CHARGING',
  SUSPENDED_EV = 'SUSPENDED_EV',
  SUSPENDED_EVSE = 'SUSPENDED_EVSE',
  FINISHING = 'FINISHING',
  RESERVED = 'RESERVED',
  UNAVAILABLE = 'UNAVAILABLE',
  FAULTED = 'FAULTED',
}

export type Tariff = {
  id: number;
  name: string;
  feePerKWH: number;
  gracePeriod: number;
  idleFee: number;
  currency: string;
};

export type Connector = {
  id: number;
  tariff: Tariff;
  hardwareSerial: string | null;
  qrCode: string;
  connectorId: number;
  format: ConnectorFormat;
  connectorType: ConnectorType;
  circuitType: CircuitType;
  status: ConnectorStatus;
};

export type Model = {
  id: number;
  name: string;
  brand: Brand;
};

type Cpo = {
  id: number;
  name: string;
  logoUrl: string;
};

enum AuthenticationMethod {
  NO_AUTHENTICATION = 'NO_AUTHENTICATION',
  TLS_WITH_BASIC_AUTHENTICATION = 'TLS_WITH_BASIC_AUTHENTICATION',
  UNSECURED_TRANSPORT = 'UNSECURED_TRANSPORT',
}
enum OcppVersion {
  OCPP_1_5 = 'OCPP_1_5',
  OCPP_1_6 = 'OCPP_1_6',
  OCPP_1_7 = 'OCPP_1_7',
}
export type Brand = {
  id: number;
  name: string;
};

export type BEChargePoint = {
  id: number;
  name: string;
  minPower: number;
  maxPower: number;
  access: Access;
  authenticationMethod: AuthenticationMethod;
  cpo: Cpo;
  ocppVersion: OcppVersion;
  model: Model;
  location: Station;
  connectors: Connector[];
  lastHeartBeat: string;
  status: Status;
  enabled: boolean;
  username: string | null;
  connected: boolean;
  verified: boolean;
} & AuditData;

export type ChargePointsResponse = {
  content: BEChargePoint[];
} & PaginationProps;

export type ChargePoint = {
  id: number;
  name: string;
  minPower: number;
  maxPower: number;
  access: Access;
  authenticationMethod: AuthenticationMethod;
  cpo: Cpo;
  ocppVersion: OcppVersion;
  model: Model;
  location: Station;
  connectors: Connector[];
  lastHeartBeat: string;
  status: Status;
  enabled: boolean;
  username: string | null;
  connected: boolean;
  verified: boolean;
} & AuditData;

export type ChargePointsTable = {
  content: ChargePointTable[];
} & PaginationProps;
export type ChargePointTable = {
  id: number;
  name: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  station: {
    type: TableDataTypes.LINK;
    value: string;
  };
  operator: {
    type: TableDataTypes.IMAGE_WITH_LINK;
    value: string;
    image: string;
  };
  connectors: {
    type: TableDataTypes.MULTI_DOTS_WITH_LINK;
    value: {
      status: string;
      url: string;
      text: string;
      placeholder: string;
    }[];
  };
  lastHeartBeat: {
    type: TableDataTypes.DATE_TIME;
    value: {
      date: string;
      time: string;
    } | null;
  };
  connectivity: {
    type: TableDataTypes.BOOLEAN;
    value: boolean;
  };
  verified: {
    type: TableDataTypes.BOOLEAN;
    value: boolean;
  };
  status: {
    type: TableDataTypes.STATUS;
    value: Status;
  };
  enabled: {
    type: TableDataTypes.TOGGLE;
    value: boolean;
  };
  createdBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  lastModifiedBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  creationDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  lastModifiedDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
};

export type ConvertedChargePoints = {
  content: ChargePoint[];
} & PaginationProps;

export type ChargePointStateModel = {
  chargePoints: ConvertedChargePoints | null;
};
