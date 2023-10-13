import { AccessType, Amenity } from '@station/station.model';

export const amenities: Amenity[] = [
  {
    name: 'Restaurants',
    value: 'RESTAURANTS',
    icon: 'restaurant.png',
  },
  { name: 'Cafe', value: 'COFFEE_SHOPS', icon: 'cofe.png' },
  { name: 'Free wifi', value: 'FREE_WIFI', icon: 'wifi.png' },
  {
    name: 'Free parking',
    value: 'FREE_PARKING',
    icon: 'parking.png',
  },
  // { name: 'Airport', value: 'AIRPORT', icon: 'airport.png'},
  // { name: 'Bank', value: 'BANK', icon: 'bank.png'},
  {
    name: 'Repair center',
    value: 'REPAIR_CENTER',
    icon: 'repair-center.png',
  },
  { name: 'Market', value: 'MARKET', icon: 'market.png' },
];
export const accessType: AccessType[] = [
  {
    label: 'Public Access',
    value: 'PUBLIC_ACCESS',
  },
  {
    label: 'Private Access',
    value: 'PRIVATE',
  },
];
