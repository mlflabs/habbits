import React, { useState, useEffect } from 'react';
import { IonLoading } from '@ionic/react';
import { Subscription } from 'rxjs';
import { loadingService } from './loadingService';

export const Loading: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);


  useEffect(() => {
    const subscriptions: Subscription[] = [
      loadingService.loading$.subscribe(loading =>{
        setShowLoading(loading);
      })
    ];
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[showLoading]);

  

  return (
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
      />
  );
};