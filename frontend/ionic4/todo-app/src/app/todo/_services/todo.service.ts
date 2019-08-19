import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';

import { TodoItemModel } from '../_models/todo-item.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  items$ = new BehaviorSubject<TodoItemModel[]>([]);

  constructor(
    private http: HttpClient,
  ) { }

  // clear the local service
  clear(): void {
    this.items$.next([]);
  }

  // get all items in the local service
  getAll(): TodoItemModel[] {
    return this.items$.getValue();
  }

  // fetch all the items from the server
  fetch(): Observable<any> {

    this.clear();

    // tslint:disable-next-line:no-string-literal
    return this.http.get(`${environment['apiBaseUrl']}todo/`)
      .pipe(
        map((data: TodoItemModel[]) => {
          return data;
        }),
        tap((items) => { if (items) { this.items$.next(items); } }),
        catchError(err => {
          return of(false);
        }),
      );
  }

  // delete an item
  delete(id: string): Observable<any> {
    // tslint:disable-next-line:no-string-literal
    return this.http.delete(`${environment['apiBaseUrl']}todo/${id}`)
      .pipe(
        map(data => {
          // tslint:disable-next-line:no-string-literal
          return (data['success'] && data['success'] === true) ? true : false;
        }
        ),
        tap((success) => { if (success) { this.deleteItem(id); } }), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        }),
      );
  }

  // delete an item from the local service
  deleteItem(id: string): boolean {
    const currentItems: TodoItemModel[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems.splice(index1, 1);
        this.items$.next(currentItems);
        return true;
      }
    }
  }
}
