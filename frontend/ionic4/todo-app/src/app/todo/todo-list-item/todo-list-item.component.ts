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

  completeStatus: boolean;
  canToggle: boolean;
  disabled: boolean;

  constructor(
    public alertController: AlertController,
    private todoService: TodoService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.completeStatus  = this.item.completed;
    this.canToggle  = true;
    this.disabled  = false;
  }

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

  toggleChange($event) {
    if ($event) {
      if (this.canToggle === true) {
        this.disabled  = true;
        this.todoService.update(this.item.id , { completed: this.completeStatus }).subscribe(
          (result) => {

            this.item.completed  = result ? this.completeStatus : !this.completeStatus;

            this.canToggle  = false;

            this.todoService.updateItem(this.item.id , this.item);

            this.completeStatus  = this.item.completed;
            this.disabled  = false;

            if (result) {
              this.presentToast('changed completed status');
            } else {
              this.presentToast('failed to change completed status');
            }
          }
        );
      } else {
        this.canToggle  = true;
      }
    }
  }

}
