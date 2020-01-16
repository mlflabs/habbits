import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar} from '@ionic/react';
import React, {  } from 'react';
import './Home.css';
import MyForm, { getValidator, FormItem } from '../modules/forms/myForm';


const Home: React.FC = () => {


  const form: FormItem[] = [
    {
      id: 'name',
      displayName: 'Your First Name: ',
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
      displayName: "A Short Note: ",
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
          <MyForm  items={form} submitFunction={submit} /> 
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

