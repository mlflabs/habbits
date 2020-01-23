import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { dataService } from '../../data/dataService';
import { GUEST, authService } from '../../auth/authService';

export enum AppStatus {
  loading, auth, guest
}

// username, authenticated, login, logout, renewToken
export function useAppStatus(): [AppStatus] {

  const [appStatus, setAppStatus] = useState({status: AppStatus.loading, dataReady: false, username: GUEST});


  console.log('APP Router Status: ', appStatus);

  useEffect(() => {
    const subscriptions: Subscription[] = [
      dataService.pouchReady$.subscribe(ready => {
        console.log('RADDY:: ', ready);
        setStatusFunction();
      }),
      authService.username$.subscribe(username => {
        console.log('USERNAME CHANGED: ', username);
        setStatusFunction();
        dataService.init( username, 
                          authService.getUser().token,
                          authService.getIsAuthenticated(), 
                          username !== GUEST);
      }),

    ];
    // usersService.loadAll();
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[]);


  const setStatusFunction = () => {
    const dataReady = dataService.ready;
    const username = authService.getUsername();
    if(dataReady){
      if(username === GUEST)
        setAppStatus({ status:AppStatus.guest, username: username, dataReady: dataReady });
      else
        setAppStatus({ status:AppStatus.auth, username: username, dataReady: dataReady });
    }
    else {
      setAppStatus({ status:AppStatus.loading, username: username, dataReady: dataReady });
    }
  };

  return [ appStatus.status ];
}