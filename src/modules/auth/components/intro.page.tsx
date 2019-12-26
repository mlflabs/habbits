import React from 'react';
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent, IonLabel } from '@ionic/react';



const IntroPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>Register</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default IntroPage;
