export interface Flight {
  id: string;
  from: string;
  to: string;
  date: string; // ISO-Format: 2017-12-24T17:00:00.000+01:00,
  delayed?: boolean;
}
