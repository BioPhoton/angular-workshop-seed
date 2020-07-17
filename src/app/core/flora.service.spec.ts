import { TestBed } from '@angular/core/testing';

import { FloraService } from './flora.service';

describe('FloraService', () => {
  let service: FloraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
