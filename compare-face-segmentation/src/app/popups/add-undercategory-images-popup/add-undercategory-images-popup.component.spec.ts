import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUndercategoryImagesPopupComponent } from './add-undercategory-images-popup.component';

describe('AddUndercategoryImagesPopupComponent', () => {
  let component: AddUndercategoryImagesPopupComponent;
  let fixture: ComponentFixture<AddUndercategoryImagesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUndercategoryImagesPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUndercategoryImagesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
