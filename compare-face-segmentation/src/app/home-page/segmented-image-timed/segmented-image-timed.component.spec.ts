import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedImageTimedComponent } from './segmented-image-timed.component';

describe('SegmentedImageTimedComponent', () => {
  let component: SegmentedImageTimedComponent;
  let fixture: ComponentFixture<SegmentedImageTimedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedImageTimedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SegmentedImageTimedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
