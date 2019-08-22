import { Component, OnInit, Input } from '@angular/core';
import { TodoItemModel } from '../_models/todo-item.interface';
import { AlertController } from '@ionic/angular';
import { TodoService } from '../_services/todo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss'],
})
export class TodoListItemComponent implements OnInit {

  @Input() item: TodoItemModel;

  constructor(
    public alertController: AlertController,
    private todoService: TodoService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {}

  delete() {
    this.presentAlertConfirm();
  }

  handleDelete() {
    this.todoService.delete(this.item.id).subscribe(
      (result) => {
        if (result === true) {
          this.presentToast('Item was deleted');
        } else {
          this.presentToast('Item was NOT deleted');
        }
      }
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Delete this item',
      message: this.item.title,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.handleDelete();
          }
        }
      ]
    });

    await alert.present();
  }

}
