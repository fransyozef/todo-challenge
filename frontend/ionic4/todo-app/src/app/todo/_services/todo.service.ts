import { PwaNetworkService } from './../../_shared/pwa-network.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';

import { TodoItemModel, TodoItemCompletedModel } from '../_models/todo-item.interface';
import { unescapeHtml } from '@angular/platform-browser/src/browser/transfer_state';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  isLoading$ = new BehaviorSubject<boolean>(false);
  items$ = new BehaviorSubject<TodoItemModel[]>([]);

  constructor(
    private http: HttpClient,
    private pwaNetworkService: PwaNetworkService,
  ) { }

  // clear the local service
  clear(): void {
    this.items$.next([]);
  }

  getItemLocal(id: string): TodoItemModel | null {
    const currentItems: TodoItemModel[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        return currentItems[index1];
      }
    }
    return null;
  }

  // get all items in the local service
  getAll(): TodoItemModel[] {
    return this.items$.getValue();
  }

  startLoading() {
    this.isLoading$.next(true);
  }

  stopLoading() {
    this.isLoading$.next(false);
  }

  updateLocalItem(id: string, payload: TodoItemModel): boolean {
    const currentItems: TodoItemModel[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems[index1]  = payload;
        this.items$.next(currentItems);
        return true;
      }
    }
    return false;
  }

  // update an item on server
  update(id: string, payload: TodoItemModel | TodoItemCompletedModel): Observable<any> {

    if (this.pwaNetworkService.isOnline() === false) {
      return of(false);
    }

    // tslint:disable-next-line:no-string-literal
    if (payload['id']) {
      // tslint:disable-next-line:no-string-literal
      delete payload['id'];
    }

    // tslint:disable-next-line:no-string-literal
    return this.http.put(`${environment['apiBaseUrl']}todo/${id}` , payload)
      .pipe(
        map(data => {
          // tslint:disable-next-line:no-string-literal
          return (data['success'] && data['success'] === true) ? data['result'] : false;
        }),
        tap((result) => {
          if (result) {
            result.id  = id;
            this.updateLocalItem(id , result);
          }
        }),
        catchError((err) => {
          return of(false);
        }),
      );
  }

  // fetch all the items from the server
  fetch(): Observable<any> {

    if (this.pwaNetworkService.isOnline() === false) {
      return of(false);
    }

    this.clear();
    this.startLoading();

    // tslint:disable-next-line:no-string-literal
    return this.http.get(`${environment['apiBaseUrl']}todo/`)
      .pipe(
        map((data: TodoItemModel[]) => {
          return data;
        }),
        tap((items) => { if (items) { this.items$.next(items); } }),
        tap(_ => { this.stopLoading(); } ),
        catchError(err => {
          this.stopLoading();
          return of(false);
        }),
      );
  }

  // delete an item
  delete(id: string): Observable<any> {

    if (this.pwaNetworkService.isOnline() === false) {
      return of(false);
    }

    // tslint:disable-next-line:no-string-literal
    return this.http.delete(`${environment['apiBaseUrl']}todo/${id}`)
      .pipe(
        map(data => {
          // tslint:disable-next-line:no-string-literal
          return (data['success'] && data['success'] === true) ? true : false;
        }),
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

  // update an item from the local service
  updateItem(id: string , payload: TodoItemModel): boolean {
    const currentItems: TodoItemModel[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        this.items$.next(currentItems);
        return true;
      }
    }
    return false;
  }

  // add an item into local database
  addItem(data: any): any {
    const currentItems: TodoItemModel[] = this.getAll();
    currentItems.push(data);
    return currentItems;
  }

  // add an item into database
  add(payload: any): Observable<any> {
    if (this.pwaNetworkService.isOnline() === false) {
      return of(false);
    }
    // tslint:disable-next-line:no-string-literal
    return this.http.post(`${environment['apiBaseUrl']}todo/` , payload)
      .pipe(
        map(data => {
          // tslint:disable-next-line:no-string-literal
          return (data['success'] && data['success'] === true) ? data['result'] : false;
        }),
        tap((result) => {
          if (result) {
            // tslint:disable-next-line:no-string-literal
            const items  = this.addItem(result);
            this.items$.next(items);
          }
        }),
        catchError((err) => {
          return of(false);
        }),
      );
  }
}
