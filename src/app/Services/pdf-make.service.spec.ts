import { TestBed } from '@angular/core/testing';

import { PdfMakeService } from './pdf-make.service';

describe('PdfMakeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfMakeService = TestBed.get(PdfMakeService);
    expect(service).toBeTruthy();
  });
});
