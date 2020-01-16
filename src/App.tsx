import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter
 } from '@ionic/react-router';
import { apps, flash, person } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Details from './pages/Details';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './modules/auth/privateRoute';
import UnauthenticatedRoute from './modules/auth/unauthenticatedRoute';
import { useUserFacade } from './modules/auth/hooks/user.hook';


// my css
import './my.css';
import LoginPage from './modules/auth/components/login.page';
import LogoutPage from './modules/auth/components/logout.page';
import UserPage from './modules/auth/components/user.page';
import RegisterPage from './modules/auth/components/register.page';
import { Loading } from './modules/loading/loading.component';
import { Toasts } from './modules/toast/toast.component';
import { NOTFOUND } from 'dns';

const App: React.FC = () => {
  
  const [authenticated] = useUserFacade();

  console.log('APP started, authenticated: ', authenticated);

  
  
  
  return (
    <IonApp>
      <IonReactRouter>
        <Loading/><Toasts/>
        {authenticated ? (
        <IonTabs>
          <IonRouterOutlet>
            <PrivateRoute path="/home" component={Home} exact={true} />
            <PrivateRoute path="/tab1" component={Tab1} exact={true} />
            <PrivateRoute path="/tab2" component={Tab2} exact={true} />
            <PrivateRoute path="/tab2/details" component={Details} exact={true} />
            <PrivateRoute path="/tab3" component={Tab3} exact={true} />
            
            <Route exact path="/auth/user" component={UserPage} />

            

            <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
            <Route path="*" component={NotFound} exact={false} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/home">
              <IonIcon icon={flash} />
              <IonLabel>Tab One</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={apps} />
              <IonLabel>Tab Two</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/auth/user">
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        ) : (
          <IonRouterOutlet>
            <UnauthenticatedRoute exact path="*" component={Home} />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
