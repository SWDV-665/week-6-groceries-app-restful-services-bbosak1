import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

/*
  Generated class for the GroceriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesServiceProvider {

  items: any = [];
  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "http://localhost:8080/";

  constructor(public http: HttpClient) {
    console.log('Initialized Groceries Svc Provider');

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  getItems(): Observable<object[]> {
    return this.http.get(this.baseURL + 'api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  removeItem(item) {
    this.http.delete(this.baseURL + "api/groceries/" + item._id)
      .subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true);
      });
  }

  addItem(item) {
    this.http.post(this.baseURL + "api/groceries", item)
      .subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true);
      });
  }

  editItem(item, index) {
    this.http.put(this.baseURL + "api/groceries/" + item._id, item)
      .subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true);
      });
  }

}
