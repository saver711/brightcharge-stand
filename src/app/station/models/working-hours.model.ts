import { TimeRegex } from '@shared/models/time.model';
import { Weekday } from '@shared/models/weekday.enum';

export interface WorkingHours {
  id?: number;
  day: Weekday;
  openAllDay: boolean;
  closingTime?: TimeRegex;
  openingTime?: TimeRegex;
}
