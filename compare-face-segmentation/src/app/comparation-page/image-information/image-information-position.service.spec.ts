import { TestBed } from '@angular/core/testing';

import { ImageInformationPositionService } from './image-information-position.service';

describe('ImageInformationPositionService', () => {
  let service: ImageInformationPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageInformationPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
