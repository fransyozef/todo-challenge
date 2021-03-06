import { PwaNetworkService } from './../../_shared/pwa-network.service';
import { LoaderService } from './../../_shared/loader.service';
import { ToastService } from './../../_shared/toast.service';
import { Component, OnInit, Input } from '@angular/core';
import { TodoItemModel } from '../_models/todo-item.interface';
import { AlertController } from '@ionic/angular';
import { TodoService } from '../_services/todo.service';
import { BehaviorSubject } from 'rxjs';

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

  online$: BehaviorSubject<boolean>;

  constructor(
    public alertController: AlertController,
    private todoService: TodoService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private pwaNetworkService: PwaNetworkService,
  ) {
    this.online$ = this.pwaNetworkService.online$;
  }

  ngOnInit() {
    this.completeStatus = this.item.completed;
    this.canToggle = true;
    this.disabled = false;
  }

  delete() {
    this.presentAlertConfirm();
  }

  handleDelete() {
    this.loaderService.show();
    this.todoService.delete(this.item.id).subscribe(
      (result) => {
        this.loaderService.hide();
        if (result === true) {
          this.toastService.toast('Item was deleted');
        } else {
          this.toastService.toast('Item was NOT deleted');
        }
      }
    );
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

    if (this.canToggle === true) {
      this.disabled = true;
      if (this.pwaNetworkService.isOnline()) { this.loaderService.show(); }
      this.todoService.update(this.item.id, { completed: this.completeStatus }).subscribe(
        (result) => {

          setTimeout(() => {

            this.loaderService.hide();
            this.item.completed = result ? this.completeStatus : !this.completeStatus;

            this.canToggle = false;

            this.todoService.updateItem(this.item.id, this.item);

            this.completeStatus = this.item.completed;
            this.disabled = false;

            if (result) {
              this.toastService.toast('changed completed status');
            } else {
              if (!this.pwaNetworkService.isOnline()) {
                this.toastService.toast('you are not online!');
              } else {
                this.toastService.toast('failed to change completed status');
              }
            }

            setTimeout(() => {
              this.canToggle = true;
            }, 500);

          }, 300);


        }
      );
    } else {
      this.canToggle = true;
    }

  }

}
