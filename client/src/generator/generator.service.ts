import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Generator } from './generators.model';

@Injectable()
export class GeneratorService {

  constructor(private http: HttpClient) {}

  public getTest$(): Observable<Generator[]> {
    return this.http.get('/api/generator').pipe(map(response => <Generator[]>response));
  }

  public postTest$(): Observable<string> {
    return this.http.post('api/',{fileName:'testing'}).pipe(map(response => JSON.stringify(response)));
  }
}