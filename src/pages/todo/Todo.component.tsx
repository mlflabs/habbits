import React, { useState } from 'react';
import { IonItem, IonLabel, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonIcon, IonInput, IonTextarea, IonFab, IonFabButton, IonButton } from '@ionic/react';
import { Todo } from './models';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_LIGHT } from '../../colors';
import { DataFunctions } from '../../modules/data/hooks/collection.hook';
import { trash, radioButtonOff, radioButtonOn, arrowDropdownCircle, arrowDropupCircle, sunny, star, list } from '../../../node_modules/ionicons/icons';
import _ from 'lodash';

const TodoComp = ({todo, selected = false, tags, dataFunctions}:
  {todo:Todo, selected?:boolean, tags:string[], dataFunctions: DataFunctions}) => {
  
  const topColor = COLOR_PRIMARY;
  const bottomColor = COLOR_SECONDARY;

  const [doc, setDoc] = useState({... {tags:[]}, ...todo});


  const handleChange = (e) => {
    const newDoc = {...doc, ...{[e.target.name]:e.detail.value}};
    setDoc(newDoc);
  }

  const handleBlur = (e) => {
    dataFunctions.save(doc);
  }

  const printLine = () => {
    if(doc.note == null || doc.note === ''){
      return 'none';
    }
    return 'full';
  }


  const doneHandler = () => {
    const newDoc = {...doc, ...{done: !doc.done}};
    setDoc(newDoc);
    dataFunctions.save(newDoc);

  }

  const handleDelete = () => {
    console.log("DELETE DOC: ", doc);
    dataFunctions.remove(doc._id);
  }

  const handleTagChange = (tag: string) => {
    console.log('handle tag change: ', tag, doc);

    const res = _.find(doc.tags, t=>t===tag);
    console.log('-------------------', res, tag, doc.tags);
    let newtags;
    if(_.isUndefined(res)){
      newtags = _.concat(doc.tags, tag);
      console.log(newtags);
    }
    else {
      newtags = _.filter(doc.tags, t=>t!==tag);
      console.log(newtags);
    }
    dataFunctions.save(Object.assign(doc, {tags: newtags}));
  }

  const printTag = (tag: string) => {
    console.log(tags, tag);
    const color = (_.includes(doc.tags,tag))? 'success': 'light';
    console.log('Print Tages color state: ', tag, color);
    if(tag === 'today')
      return (<IonButton key={tag} color={color} onClick={() => handleTagChange(tag)}>
                  <IonIcon icon={sunny} /><IonLabel>{tag}</IonLabel>
              </IonButton>);
    if(tag === 'important')
      return (<IonButton key={tag} color={color} onClick={() => handleTagChange(tag)}>
                  <IonIcon icon={star} /><IonLabel>{tag}</IonLabel>
              </IonButton>); 
  }

  console.log('Selected:::::::::::', selected);

  const print = () => {
    if(!selected) {
      return (
        <IonCard   color={''} >

          
            <IonItem color={''}   lines={printLine()}>
            {doc.done? (
              <IonIcon  style={{'paddingRight':'10px'}} 
                        icon={radioButtonOn} onClick={doneHandler} />
            ) : (
              <IonIcon  style={{'paddingRight':'10px'}} 
                        icon={radioButtonOff} onClick={doneHandler} />
            )}
            <IonIcon  icon={arrowDropdownCircle} slot="end" 
                      onClick={() => dataFunctions.select(doc)} />
            <IonInput  
                  name="title"
                  placeholder="Enter Title Here" 
                  onIonChange={handleChange}
                  onIonBlur={handleBlur}
                  value={doc.title} />
            </IonItem>
          
            {doc.note? (
              <IonCardSubtitle style={{padding: '10px'}}>{doc.note}</IonCardSubtitle>
            ) : (
              <></>
            )}
            
          
        </IonCard>  
      );
    }
    else {
      return (
        <IonCard  color={topColor} >
          <IonItem  color={topColor} lines={printLine()}>
            {doc.done? (
                <IonIcon  style={{'paddingRight':'10px'}} 
                          icon={radioButtonOn} onClick={doneHandler} />
            ) : (
                <IonIcon  style={{'paddingRight':'10px'}} 
                          icon={radioButtonOff} onClick={doneHandler} />
            )}
            <IonIcon  icon={arrowDropupCircle} slot="end" 
                      onClick={() => dataFunctions.select(null)} />
              <IonInput 
                 
                  name="title"
                  placeholder="Enter Title Here" 
                  onIonChange={handleChange}
                  onIonBlur={handleBlur}
                  value={doc.title} />
            </IonItem>
            <IonCardSubtitle>
              <IonTextarea 
                placeholder="Enter more information here..."
                name="note"
                onIonChange={handleChange}
                onIonBlur={handleBlur}
                value={doc.note}
                ></IonTextarea>
            </IonCardSubtitle>
            <IonItem color={bottomColor}>
             { tags.map(tag => printTag(tag)) }

             <IonFabButton size="small" slot="end" onClick={handleDelete}>
                <IonIcon icon={trash} />
             </IonFabButton>
            </IonItem>

        </IonCard>  
      );
    }
  }
  
  return print();
};

export default TodoComp;

