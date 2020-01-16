import React, { FunctionComponent } from "react";
import { Route, Redirect, useLocation, useHistory, useParams } from "react-router-dom";
import { useUserFacade } from "./hooks/user.hook";
import LoginPage from './components/login.page';
import RegisterPage from './components/register.page';


const UnauthenticatedRoute = ({ component, exact, path }: 
  { component: FunctionComponent<{}>, exact: boolean, path: string }) => {

  const [authenticated] = useUserFacade();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  //const path = location.pathname;
  
  console.log("Location:::: ", location);
  console.log('HISTORY:::: ', history);
  console.log('PARAMS:::: ', params);

  

  const getRoute = () => {
    if(location.pathname === '/auth/register'){
      return <Route path={path} component={RegisterPage} exact={exact} />;
    }
    else if(location.pathname === '/auth/login'){
      return <Route
                path='/auth/login'
                render={(props) => <LoginPage />}
              />
    }
    else {
    return <Redirect to={{
              pathname: "/auth/login",
              state: {prev: location.pathname}
            }}/>;
    }
  }
  

  return (
    getRoute()
  );
}





/*




const  PrivateRoute = ({ component: Component, ...rest }) => {

  const [authenticated] = useUserFacade();
  //const location = useLocation();

  //console.log(location);


  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/auth/login"}}
          />
        )
      }
    />
  );
}
*/
export default UnauthenticatedRoute;