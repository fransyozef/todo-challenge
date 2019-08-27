import { ToastService } from './../../_shared/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoItemModel } from '../_models/todo-item.interface';
import { TodoService } from '../_services/todo.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.page.html',
  styleUrls: ['./todo-detail.page.scss'],
})
export class TodoDetailPage implements OnInit {

  itemForm: FormGroup;
  item: TodoItemModel;
  pageTitle: string;
  buttonText: string;

  id: string;
  showForm: boolean;

  constructor(
    private todoService: TodoService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.showForm  = false;
    this.pageTitle = 'Add todo item';
    this.buttonText  = 'Add';
  }

  ngOnInit() {
    this.resolveRoute();
  }

  resolveRoute() {

    this.route.params.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      if (params['id']) {
        // tslint:disable-next-line:no-string-literal
        this.id = params['id'];
        this.getItem();
      } else {
        // this.handleItemNotFound();
        this.initForm();
      }
    });
  }

  getItem() {
    if (this.id) {
      const item  = this.todoService.getItemLocal(this.id);
      if (item) {
        this.item  = item;
        this.pageTitle  = 'Edit todo item';
        this.buttonText = 'Update';
        this.initForm();
      } else {
        this.toastService.toast('Cannot find todo item');
        this.navCtrl.navigateRoot('/todo');
      }
    }
  }

  submit() {
    if (this.itemForm.valid) {
      if (this.item) {
        this.todoService.update(this.id, this.itemForm.value).subscribe(
          (result) => {
            if (result) {
              this.toastService.toast('Todo item was updated');
              this.item  = result;
            } else {
              this.toastService.toast('Todo item was NOT updated');
            }
          }
        );
      } else {
        this.todoService.add(this.itemForm.value).subscribe(
          (result) => {
            this.toastService.toast('A new todo item was added');
            this.navCtrl.navigateRoot('/todo');
          }
        );
      }
    } else {
      this.toastService.toast('You forgot some required fields!');
    }
  }

  private initForm() {
    this.itemForm = new FormGroup({
      title: new FormControl(this.item ? this.item.title : '', Validators.required),
      completed: new FormControl(this.item ? this.item.completed : false),
      id: new FormControl(this.item ? this.item.id : null),
    });
    this.showForm  = true;
  }

  private makeid(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 25; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
