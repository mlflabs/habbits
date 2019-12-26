import React from 'react';
import { Redirect, Route } from 'react-router';
import LoginPage from './components/login.page';
import LogoutPage from './components/logout.page';
import UserPage from './components/user.page';
import RegisterPage from './components/register.page';


const authRoutes = (
  <Route path="auth" render={() => <Redirect to="/auth/user" />} >
    <Route exact path="/auth/login" component={LoginPage}/>
    <Route exact path="/auth/logout" component={LogoutPage}/>
    <Route exact path="/auth/user" component={UserPage}/>
    <Route exact path="/auth/register" component={RegisterPage}/>

  </Route>
)


export default authRoutes;