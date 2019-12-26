import React, { FunctionComponent } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useUserFacade } from "./hooks/user.hook";


const PrivateRoute = ({ component, exact, path}: 
  { component: FunctionComponent<{}>, exact: boolean, path: string }) => {

  const [authenticated] = useUserFacade();
  const location = useLocation();

  if(!authenticated)
    console.log(location);
    

  return (
    authenticated? (
      <Route path={path} component={component} exact={exact} />
    ) : (
      <Redirect to="/auth/login"/>
    )
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
export default PrivateRoute;