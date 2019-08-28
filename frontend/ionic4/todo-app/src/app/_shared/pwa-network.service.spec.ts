import { TestBed } from '@angular/core/testing';

import { PwaNetworkService } from './pwa-network.service';

describe('PwaNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PwaNetworkService = TestBed.get(PwaNetworkService);
    expect(service).toBeTruthy();
  });
});
