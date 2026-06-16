import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../__environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDataInterface } from '../../../_gps/_models/userdata.models';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/clients-token`;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/get-all-clients-compacted`)
      .pipe(map((response) => response.data));
  }
}
