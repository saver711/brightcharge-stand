import { StateClass } from '@ngxs/store/internals';
import { OperatorState } from '../operator/state/operator.state';
import { SessionState } from '../user-management/state/session.state';
import { UserState } from '../user/state/user.state';
import { StationState } from '../station/state/station.state';
import { ChargePointState } from '../charge-point/state/charge-point.state';

export const appStates: StateClass[] = [
  SessionState,
  OperatorState,
  UserState,
  StationState,
  ChargePointState,
];
