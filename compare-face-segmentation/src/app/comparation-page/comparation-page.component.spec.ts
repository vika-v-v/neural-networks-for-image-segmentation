import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparationPageComponent } from './comparation-page.component';

describe('ComparationPageComponent', () => {
  let component: ComparationPageComponent;
  let fixture: ComponentFixture<ComparationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
