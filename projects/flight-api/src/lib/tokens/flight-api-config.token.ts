import {InjectionToken} from '@angular/core';
import {FlightApiConfig} from 'flight-api/src/lib/interfaces/flight-api-config.interface';

export const FLIGHT_API_CONFIG_TOKEN = new InjectionToken<FlightApiConfig>('TranslationManagerConfigToken');
