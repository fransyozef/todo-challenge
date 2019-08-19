import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { TodoService } from './todo/_services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Todo',
      url: '/todo',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private todoService: TodoService,
  ) {
    this.initializeApp();

    this.todoService.fetch().subscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }
}
