import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
  ) {
    window.matchMedia("(prefers-color-scheme: dark)")
    this.platform.ready().then(() => {
      document.body.classList.toggle("dark");
    });
  }
}
