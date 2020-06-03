import {Flight} from './models/flight';

export const flights: Flight[] = [
  {
    id: 1,
    from: 'Vienna',
    to: 'Berlin',
    date: new Date().toISOString(),
    delayed: false
  },
  {
    id: 2,
    from: 'Vienna',
    to: 'Zurich',
    date: new Date().toISOString(),
    delayed: false
  },
  {
    id: 3,
    from: 'Berlin',
    to: 'Graz',
    date: new Date().toISOString(),
    delayed: false
  }
];
