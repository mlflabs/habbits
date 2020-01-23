
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { isEqual } from 'lodash';
import anylogger from 'anylogger';
import localStorageService from '../localStorage/localStorageService';
import {env} from '../../env';
import  { getPostRequest, post, ajaxResponse } from '../ajax/ajax';
import { toastService } from '../toast/toastService';


const log =  anylogger('auth: authService');



export enum AuthStatus {
  Loading, 
  Guest, //not loged in
  User // loged in
}


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
    token_expiery: values.token_expiery||values.expires||null
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
  //private _authReady = false;
  //public authReady$ = new BehaviorSubject(this._authReady);
  //private _isAuthenticated = false;
  //public isAuthenticated$  = new BehaviorSubject(false);

  private _authStatus = AuthStatus.Loading;
  
  public authStatus$ = new BehaviorSubject(this._authStatus);
  
  public username$ = new BehaviorSubject(this._user.username);

  constructor() {
    this.loadAuth();
  }

  getIsAuthenticated():boolean { return this._authStatus === AuthStatus.User; }
  getUsername() { return this._user.username; }
  getEmail() { return this._user.email;}
  getUser() { return this._user };


  async updateUser(user: User, forceLogout = false) {
    log.info('Userupdate: ', user, forceLogout, this._authStatus);
    if(!isGuest(user)) {
      if(user.username !== this._user.username){
        this.username$.next(user.username);
      }

      if(!isEqual(this._user, user)) {
        this._user = user;
        await localStorageService.setObject(AUTH_USER_KEY, user)
      }
      
      if(this._authStatus !== AuthStatus.User) {
        this.setAuthStatus(AuthStatus.User);
      }
      return;
    }

    if(this._authStatus !== AuthStatus.Guest){
      this.setAuthStatus(AuthStatus.Guest)
  
      if(forceLogout){
        await localStorageService.setObject(AUTH_USER_KEY, getGuestUser);
      }
    }
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


  public async login(id: string, password: string):Promise<ajaxResponse> {
    const res = await post( getPostRequest(env.AUTH_API_URL+'/auth/login',
      { username: id, password: password, app: env.APP_ID },
      null, true,  'Login in, please wait'));

    return res;
  }

  public async loginAndRedirect(id: string, password: string, history, location) {
    console.log('LoginWithRedirect:: ');
    const res = await post( getPostRequest(env.AUTH_API_URL+'/auth/login',
      { username: id, password: password, app: env.APP_ID },
      null, true,  'Login in, please wait'));

      console.log("Login RES: ", res);
      if(res.success) {
        this.updateUser(getUser(res.data))
        console.log("LOGIN LOCATION:::: ", location, history);
  
        console.log("HISTORY REDIRECT::: ", location.state.prev);
        const next = location.state.prev.startsWith('/auth/')? '/': location.state.prev;
        const redirect = next || '/';
        history.push(redirect);
      }
      else {
        console.log(res);
        toastService.printServerErrors(res);
      }
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


  private setAuthStatus(status:AuthStatus){
    this._authStatus = status;
    this.authStatus$.next(status);
  }

  public getAuthStatus():AuthStatus {
    return this._authStatus;
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

