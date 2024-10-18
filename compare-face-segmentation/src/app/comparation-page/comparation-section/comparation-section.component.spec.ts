import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparationSectionComponent } from './comparation-section.component';

describe('ComparationSectionComponent', () => {
  let component: ComparationSectionComponent;
  let fixture: ComponentFixture<ComparationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparationSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
