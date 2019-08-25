import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'todo', loadChildren: './todo/todo.module#TodoPageModule' },
  { path: '**', redirectTo: '/todo', pathMatch: 'full' },
  { path: '',  redirectTo: '/todo', pathMatch: 'full' },
// catch all route
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
