import React, { useState, FormEvent } from 'react';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonPage
} from "@ionic/react";

const LoginPage: React.FC = () => {

  const [form, setForm] = useState({id:'', password:''});
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // const user = await login(email, password);

      // ...
    } catch (e) {
      console.error(e);
    }
  }

  const handleInputChange = (e) => {
    setForm({...form, ...{[e.target.name]: e.target.value}});
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={e => handleSubmit(e)} action="post">
          <IonList>
            <IonItem>
              <IonLabel>Email</IonLabel>
              <IonInput  name="id" value={form.id} onInput={(e: any) => handleInputChange(e)} />
            </IonItem>
            <IonItem>
              <IonLabel>Password</IonLabel>
              <IonInput name="password" type="password" value={form.password} 
                  onInput={(e: any) => handleInputChange(e)} />
            </IonItem>
            <IonButton type="submit">Log in</IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
