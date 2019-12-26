import {
  IonPage,
  IonList,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonAvatar,
  IonLoading
} from '@ionic/react';
import { book, build, colorFill, grid, arrowRoundBack } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import './Home.css';
import MyForm, { getValidator, FormItem } from '../modules/forms/myForm';


const Home: React.FC = () => {


  const form: FormItem[] = [
    {
      id: 'name',
      name: 'Your First Name: ',
      type: 'string',
      validators: [
        getValidator('isLength', {min:3, max:20}, 'Name needs to be at least 1 char long')
  
      ],
      messages:[
        'Temp message', 'Message 2', 'Message 3'
      ]
    },
    {
      id: 'note',
      name: "A Short Note: ",
      type: 'text',
      validators: [
        getValidator('isEmpty'),
      ]
    },
    {
      id: 'note2',
      type: 'text',
      validators: [
        getValidator('isEmpty'),
      ]
    }
  ]
  
  const submit = (form) => {
    console.log(form);
  }








  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Habbits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <div style={{padding:'20px'}}>
          <MyForm  schema={form} submitFunction={submit} /> 
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

