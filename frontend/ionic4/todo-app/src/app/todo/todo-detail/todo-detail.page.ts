import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoItemModel } from '../_models/todo-item.interface';
import { TodoService } from '../_services/todo.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.page.html',
  styleUrls: ['./todo-detail.page.scss'],
})
export class TodoDetailPage implements OnInit {

  itemForm: FormGroup;
  item: TodoItemModel;
  pageTitle: string;

  constructor(
    private todoService: TodoService,
    public toastController: ToastController,
    private navCtrl: NavController,
  ) { 
    this.pageTitle  = 'Add todo item';
  }

  ngOnInit() {
    this.initForm();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }

  submit() {
    if (this.itemForm.valid) {
      if (this.item) {

      } else {
        this.todoService.add(this.itemForm.value).subscribe(
          (result) => {
            this.presentToast('A new todo item was added');
            this.navCtrl.navigateRoot('/todo');
          }
        );
      }
    } else {
      console.log('nope');
    }
  }

  private initForm() {
    this.itemForm = new FormGroup({
      title: new FormControl(this.item ? this.item.title : '', Validators.required),
      completed: new FormControl(this.item ? this.item.completed : false),
      id: new FormControl(this.item ? this.item.id : null),
    });
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
