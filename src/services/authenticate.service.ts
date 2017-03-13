import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticateService {
	private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http) { }

	public getUsers(): Observable<any> {
		return this.http.get('/user').map(res => res.json());
	}

	getTable(): Observable<any> {
		return this.http.get('/table').map(res => res.json());
	}



}
