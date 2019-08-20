import { Component, OnInit } from '@angular/core';
import { Observable, Subject,throwError, of , BehaviorSubject} from 'rxjs';
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

  constructor(
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    this.items$  = this.todoService.items$;
    this.isLoading$  = this.todoService.isLoading$;
  }

  refresh() {
    this.todoService.fetch().subscribe();
  }

}
