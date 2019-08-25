import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo.page';
import { TodoListItemComponent } from './todo-list-item/todo-list-item.component';
import { TodoDetailPage } from './todo-detail/todo-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TodoPage
  },
  {
    path: 'new',
    component: TodoDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TodoPage,
    TodoDetailPage,
    TodoListItemComponent
  ]
})
export class TodoPageModule {}
