import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedImageComponent } from './segmented-image.component';

describe('SegmentedImageComponent', () => {
  let component: SegmentedImageComponent;
  let fixture: ComponentFixture<SegmentedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SegmentedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
