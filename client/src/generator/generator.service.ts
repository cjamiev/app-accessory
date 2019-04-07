import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneratorService {

  constructor(private http: HttpClient) {}

  public getTest$(): Observable<Object> {
    return this.http.get('/api/generator').pipe(map(response => response));
  }

  public postTest$(): Observable<string> {
    return this.http.post('api/',{fileName:'testing'}).pipe(map(response => JSON.stringify(response)));
  }
}