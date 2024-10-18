import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCategoriesMenuComponent } from './image-categories-menu.component';

describe('ImageCategoriesMenuComponent', () => {
  let component: ImageCategoriesMenuComponent;
  let fixture: ComponentFixture<ImageCategoriesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCategoriesMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageCategoriesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
