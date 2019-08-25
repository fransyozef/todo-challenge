import { Component, OnInit } from '@angular/core';
import { Observable, Subject, throwError, of , BehaviorSubject} from 'rxjs';
import { TodoService } from './_services/todo.service';
import { TodoItemModel } from './_models/todo-item.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  items$: BehaviorSubject<TodoItemModel[]>;

  isLoading$: BehaviorSubject<boolean>;

  filterStatus: string;

  constructor(
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    this.filterStatus  = 'all';

    this.items$  = this.todoService.items$;
    this.isLoading$  = this.todoService.isLoading$;
  }

  refresh() {
    this.todoService.fetch().subscribe();
  }

  segmentChanged($event) { 
    this.filterStatus  = $event.detail.value;
  }

  private makeid(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 25; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  filterItems(items: TodoItemModel[]) {
    const filteredItems  = items.filter(
      (item) => {
        switch(this.filterStatus) {
          default :
          case 'all' : {
            return true;
          }
          case 'completed' : {
            return item.completed === true ? true : false ;
          }
          case 'todo' : {
            return item.completed !== true ? true : false ;
          }
        }
      }
    );
    return filteredItems;
  }

}
