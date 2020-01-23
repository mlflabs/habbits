import React, { useState, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import { Subscription } from 'rxjs';
import { toastService, ToastMessage } from './toastService';



export const Toasts: React.FC = () => {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const subscriptions: Subscription[] = [
      toastService.messages$.subscribe((m: ToastMessage) =>{
        setMessage(m);
      })
    ];
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[message]);

  console.log('PRINTING TOAST: ', message);

  const print = () => {
    if(message)
      return <IonToast
                isOpen={message != null}
                message={message.message}
                duration={message.duration}
                onDidDismiss={() => setMessage(null)}
              />
  } 


  return (
    <div className='toastDiv' >
      {print()}
    </div>
  );
};