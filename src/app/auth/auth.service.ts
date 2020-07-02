import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId: string;
  registered? : boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  private expirationTokenTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.expirationTokenTimer) {
      clearTimeout(this.expirationTokenTimer);
    }
    this.expirationTokenTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.expirationTokenTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {email: string, id: string, _token: string, _tokenExpDate: string} = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpDate));

    if(loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expDuration);
    }
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCfMztBj9zXSDfl4e-w5svsKme11VjfaMY',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(response => {
      this.handleAuth(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCfMztBj9zXSDfl4e-w5svsKme11VjfaMY',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(response => {
      this.handleAuth(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime()+ +expiresIn*1000);
      const user = new User(email, userId, token, expDate);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = "An unknown error occurred!";

      if(!error.error || !error.error.error) {
        return throwError(errorMsg);
      }

      switch(error.error.error.message) {
        case 'EMAIL_EXISTS' :
          errorMsg = 'The email address is already in use by another account.';
        break;
        case 'EMAIL_NOT_FOUND' :
          errorMsg = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
        case 'INVALID_PASSWORD' :
          errorMsg = 'The password is invalid or the user does not have a password.';
        break;
      }

    return throwError(errorMsg);
  }

}
