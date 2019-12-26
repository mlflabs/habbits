
import { BehaviorSubject, throwError, Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import { isEqual } from 'lodash';
import anylogger from 'anylogger';
import axios from 'axios';
import localStorageService from '../storage/localStorageService';
import env from '../../env';


const log =  anylogger('auth: authService');




export const GUEST = 'Guest';
export const AUTH_USER_KEY = 'auth-user-key';
export interface AuthEvent {
  success: boolean;
  code: number;
  data: any;
}




export interface User {
  username: string;
  email: string|null;
  token: string|null;
  token_expiery: number|null;
}

export const getUser = (values: any):User => {
  if(values == null)
    return {
      username: GUEST,
      email: null,
      token: null,
      token_expiery: null
    }

  return {
    username: values.username || GUEST,
    email: values.email||null,
    token: values.token||null,
    token_expiery: values.string||null
  }
}

export const isGuest = (user:User) => {
  return user.username === GUEST;
}

export function getGuestUser():User {
  return getUser({ username: 'Guest' });
}









export class AuthService {
  private _user:User = getGuestUser();
  private _authReady = false;
  public authReady$ = new BehaviorSubject(this._authReady);
  private _isAuthenticated = false;
  public isAuthenticated$  = new BehaviorSubject(false);
  public username$ = new BehaviorSubject(this._user.username);

  constructor() {
    this.loadAuth().then(() => {
      this._authReady = true;
      this.authReady$.next(true);
    });
  }

  getIsAuthenticated() {
    return this._isAuthenticated;
  }

  getUsername() {
    return this._user.username;
  }

  getEmail() {
    return this._user.email;
  }


  updateUser(user: User, forceLogout = false) {
    log.info('Userupdate');
    if(!isGuest(user)) {
      if(user.username !== this._user.username){
        this.username$.next(user.username);
      }

      if(!isEqual(this._user, user)) {
        this._user = user;
      }
      
      if(!isEqual(this._isAuthenticated, true)) {
        this._isAuthenticated = true;
        this.isAuthenticated$.next(true);
      }
      return;
    }

    if(!this._isAuthenticated && !forceLogout) return;

    // this.user$.next(this._user);
    this._isAuthenticated = false;
    this.isAuthenticated$.next(false);

  }




  async loadAuth() {
    log.info('Check login');
    try {
      const user = getUser(await localStorageService.getObject(AUTH_USER_KEY));

      if(!user.token || !user.token_expiery) {
        return this.updateUser(getGuestUser());
      }

      log.info('LOADED UER', user);

      const exp = moment.unix(user.token_expiery);
      if(exp.isAfter(moment.now())) {
        log.info('TOKEN VALID');
        return this.updateUser(user);
      }
      else {
        log.warn('TOKEN is old');
        return this.updateUser(getGuestUser())
      }
    }
    catch(e) {
      log.error(e);
      return this.updateUser(getGuestUser())
    }
  }


  public async login(name: string, password: string, strategy: string = 'local') {

    /*
const res = await this.http.post(environment.auth_api+'/auth/login',
      {
          strategy: 'local',
          id: name,
          app: environment.app_id,
          password: password

    */
    const res = await axios({
      url: env.AUTH_API_URL,
      method: 'get'
    })

    console.log(res);
    
  }

  public async logout() {
    
  }

  public async renewToken() {
    //const res = await this.http.post(environment.auth_api+'/auth/renewJWT
  }

  public async register() {
    /*
    onst res = await this.http.post(environment.auth_api+'/auth/register',
        {
          strategy: 'local',
          email: credentials.email,
          password: credentials.password,
          username: credentials.username
        }, {}).toPromise();
      */
  }

  public async forgotPassword() {
    //const res = await this.http.post(environment.auth_api+'/auth/forgotpassword'
  }
}
export const authService = new AuthService();





/*
export function createAuthEvent(success: boolean = true,
  code = 1,
  data = {}): AuthEvent {
  return {
    success, code, data
  };
}
*/

