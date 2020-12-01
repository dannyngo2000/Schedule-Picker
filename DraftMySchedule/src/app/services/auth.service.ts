import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;
  helper = new JwtHelperService();
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  //register to the api
  registerUser(user): Observable<Message> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<Message>(
      'http://localhost:3000/users/register',
      user,
      {
        headers: headers,
      }
    );
  }
  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<Message>(
      'http://localhost:3000/users/authenticate',
      user,
      {
        headers: headers,
      }
    );
  }
  getProfile() {
    this.loadToken();
    let headers = new HttpHeaders().set('Authorization', this.authToken);

    return this.http.get<User>('http://localhost:3000/users/profile', {
      headers: headers,
    });
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('id_token');
    // Check whether the token is expired and return
    // true or false

    return !this.helper.isTokenExpired(token);
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  changePassword(username: string, newPassword: string) {
    let headers = new HttpHeaders().set('Authorization', this.authToken);
    let body = {
      username: username,
      newPassword: newPassword,
    };
    return this.http.post('http://localhost:3000/users/updatePassword', body, {
      headers: headers,
    });
  }
  deactivate(username: string) {
    let headers = new HttpHeaders().set('Authorization', this.authToken);
    let body = {
      username: username,
    };
    return this.http.post('http://localhost:3000/users/deactivate', body, {
      headers: headers,
    });
  }
}
