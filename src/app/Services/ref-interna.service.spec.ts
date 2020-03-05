import { TestBed } from '@angular/core/testing';

import { RefInternaService } from './ref-interna.service';

describe('RefInternaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefInternaService = TestBed.get(RefInternaService);
    expect(service).toBeTruthy();
  });
});
