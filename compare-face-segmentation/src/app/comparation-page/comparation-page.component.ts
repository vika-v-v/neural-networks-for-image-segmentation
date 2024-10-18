import { Component } from '@angular/core';

@Component({
  selector: 'app-comparation-page',
  templateUrl: './comparation-page.component.html',
  styleUrl: './comparation-page.component.css'
})
export class ComparationPageComponent {
  title = 'compare-face-segmentation';
  selectedUndercategoryId: number = 1;

  handleUndercategorySelection(undercategoryId: number) {
    this.selectedUndercategoryId = undercategoryId;
  }
}
