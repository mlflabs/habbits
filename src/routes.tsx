import React, {  } from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import {  } from 'react-router-dom';
import { apps, flash, person } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Details from './pages/Details';
import UserPage from './modules/auth/components/user.page';
import TodosPage from './pages/todo/Todos.page';
import IntroPage from './modules/auth/components/intro.page';
import { useAppStatus, AppStatus } from './modules/app/hooks/appStatus.hook';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import UnauthenticatedRoute from './modules/auth/unauthenticatedRoute';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';

export const Routes = () => {
  const [appStatus] = useAppStatus();
  const history = useHistory();
  const location = useLocation();

  console.log('APP RERENDER::::::::::::::::::::::::::::::::::::::', appStatus, location, history);
  

  if(appStatus === AppStatus.auth && location.pathname.startsWith('/auth/')){
    const newpath = location.state['prev'] || '/';
    history.push(newpath);
  }

  const getRoutes = () => {
    switch(appStatus){
      case AppStatus.auth:
        return (
          <IonTabs>
            <IonRouterOutlet>
                <Route path="/home" component={Home} exact={true} />
                <Route path="/tab1" component={Tab1} exact={true} />
                <Route path="/tab2" component={Tab2} exact={true} />
                <Route path="/tab2/details" component={Details} exact={true} />
                <Route path="/tab3" component={Tab3} exact={true} />              
                <Route exact path="/auth/user" component={UserPage} />
                <Route path="/todos" component={TodosPage} exact={true} />
                <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
                <Route path="/404" component={NotFound} />
                <Redirect to="/404" />
                
            </IonRouterOutlet>
  
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/home">
                <IonIcon icon={flash} />
                <IonLabel>Tab One</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/todos">
                <IonIcon icon={apps} />
                <IonLabel>Todo</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/settings">
                <IonIcon icon={person} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )
      case AppStatus.guest:
          return (
            <IonRouterOutlet>
              <UnauthenticatedRoute exact path="*" component={Home} />
            </IonRouterOutlet>
          );
      default:
          return (
            <IonRouterOutlet>
              <Route exact path="*"  component={IntroPage} />
            </IonRouterOutlet>
          );
      

    }
  }

  return getRoutes();
}