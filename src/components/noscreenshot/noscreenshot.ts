import { Component } from '@angular/core';

/**
 * Generated class for the NoscreenshotComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'noscreenshot',
  templateUrl: 'noscreenshot.html'
})
export class NoscreenshotComponent {

  constructor() {
    console.log('Hello NoscreenshotComponent Component');

  }

  confirm(){
    $(".noScreenshotCotainer").hide();
  }

}
