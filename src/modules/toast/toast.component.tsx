import React, { useState, useEffect } from 'react';
import { IonLoading, IonToast } from '@ionic/react';
import { Subscription } from 'rxjs';
import { toastService, ToastMessage } from './toastService';



export const Toasts: React.FC = () => {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [message2, setMessage2] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const subscriptions: Subscription[] = [
      toastService.messages$.subscribe(m =>{
        setMessage(m);
        setMessage2(m);
      })
    ];
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[message]);

  console.log('PRINTING TOAST: ', message);
  const msg = message !== null? message.message : "null";

  const print = () => {
    if(message)
      return <IonToast
                isOpen={message != null}
                message={message.message}
                duration={message.duration}
                onDidDismiss={() => setMessage(null)}
              />
  } 

  const print2 = () => {
    if(message2)
      return <IonToast
                isOpen={message2 != null}
                message={message2.message}
                duration={message2.duration+2000}
                onDidDismiss={() => setMessage2(null)}
              />
  } 
  

  return (
    <div className='toastDiv' >
      {print()}
    </div>
  );
};