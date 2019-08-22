import { Component, OnInit, Input } from '@angular/core';
import { TodoItemModel } from '../_models/todo-item.interface';
import { AlertController } from '@ionic/angular';
import { TodoService } from '../_services/todo.service';

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
  ) { }

  ngOnInit() {}

  delete() { 
    this.presentAlertConfirm();
  }

  handleDelete() {
    this.todoService.delete(this.item.id).subscribe();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Delete this item',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            // console.log('Confirm Okay');
            this.handleDelete();
          }
        }
      ]
    });

    await alert.present();
  }

}
