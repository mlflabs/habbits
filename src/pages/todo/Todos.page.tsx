import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonItem,
  IonToolbar,
  IonInput,
  IonFabButton,
  IonFabList,
  IonFab,
  IonIcon,
  IonLabel,
  IonBadge} from '@ionic/react';


import TodoComp from './Todo.component';
import { useDataCollectionFacade } from '../../modules/data/hooks/collection.hook';
import { dataService } from '../../modules/data/dataService';
import { Doc } from '../../modules/data/models';
import { arrowDropupCircle, cog, sunny, star, list, trash, checkmarkCircle, checkmarkCircleOutline } from '../../../node_modules/ionicons/icons';
import { useTodosCollectionFacade } from './hooks/todos.hook';







const TodosPage: React.FC = () => {

  const [newTitle, setNewTitle] = useState('');
  const [state, dataFunc] = useTodosCollectionFacade(dataService.getDefaultProject());
  console.log('STATE::: ', state);
  const { docs, selectedTodo, tags, doneTodos } = state;

  const changeDoneTodoFilter = () => {
    dataFunc.changeDoneFilter(!doneTodos);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
        <IonItem>  
          <IonInput
            className="new-todo"
            placeholder="What needs to be done?"
            autofocus
            onKeyPress={e =>{
              if(e.key === 'Enter'){
                console.log('ENTER: ', newTitle);
                dataFunc.save(new Doc({title: newTitle}));
                setNewTitle('');
              }
            }}
            onIonChange={e => {
              setNewTitle(e.detail.value);
            }}
            value={newTitle}
          />
        </IonItem>
        <IonList>
            {docs.map(todo => (
              <TodoComp todo={todo} 
                        tags={tags}
                        dataFunctions={dataFunc}
                        selected={(selectedTodo && todo._id === selectedTodo._id)} 
                        key={todo._id} 
              />
            ))}
        </IonList>
         <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={cog} />
          </IonFabButton>

          <IonFabList side="top">
            <IonFabButton color="primary" 
                          onClick={() => dataFunc.selectTag('all')} >
              <IonIcon icon={list} />
            </IonFabButton>
            <IonFabButton color="primary"
                          onClick={() => dataFunc.selectTag('important')} >
              <IonIcon icon={star} />
            </IonFabButton>
            <IonFabButton color="primary"
                          onClick={() => dataFunc.selectTag('today')} >
              <IonIcon icon={sunny} />
            </IonFabButton>
          </IonFabList>

          <IonFabList side="start">
            <IonFabButton color="primary" onClick={()=> changeDoneTodoFilter()}>
              <IonIcon icon={(doneTodos)? checkmarkCircle: checkmarkCircleOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TodosPage;

