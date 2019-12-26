import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { authService } from '../authService';

import anylogger from 'anylogger';
const log =  anylogger('auth: authService');

// username, authenticated, login, logout, renewToken
export function useUserFacade(): [boolean, String] {

  

  const [username, setUsername] = useState<string>(authService.getUsername()); 
  const [authenticated, setAuthenticated] = useState<boolean>(authService.getIsAuthenticated());


  useEffect(() => {
    const subscriptions: Subscription[] = [
      authService.isAuthenticated$.subscribe(authenticated => {
        log.info(authenticated);
        setAuthenticated(authenticated);
      }),
      authService.username$.subscribe(username => {
        log.info(username);
        setUsername(username);
      }),

    ];
    
    // usersService.loadAll();
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[]);



  return [authenticated, username];
}