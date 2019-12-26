import React, { useEffect, useState, Dispatch } from 'react'
import { FormItem } from './myForm';
import MyInput from './myInput';
import { saveIntoArray, findById } from '../../utils';
import { IonItem, IonButton } from '@ionic/react';
import validator from 'validator';
import { throwError } from 'rxjs';


// use to generate form, usually from outside form passed into here
export interface FormItem { 
  id: string;
  name?: string;
  type: string;
  messages?: string[];
  validators?: any[];  
  default?: any;
}

export interface ValidatorItem {
  type: string;
  message?: string|null;
  options?: any;
}


// use to hold form state
export interface FormValueItem {
  id: string;
  name: string;
  value: string;
  messages: string[];
  errors: string[];
  dirty: boolean;
  hasValidation:boolean;
  //status: number; //0: untouched, 1: valid, 2: not valid
}

export interface Props {
  schema: FormItem[],
  submitFunction: Function
}

export interface State {
  items: FormValueItem[],
  valid: boolean
}

export function getValidator(type:string, options:any = null, message:string|null = null):ValidatorItem {
  return {type, options, message};
}

const MyForm = ({schema, submitFunction}:Props) => {

  const [state, setState] = useState<State>({items:[], valid:false});



  useEffect(() => {
    let model: FormValueItem[] = [];
    // go thourgh props and generate our model from schema;
    if(schema) { //no schema, do nothing
      schema.forEach((item:FormItem) => {
        model.push(getItem( item.id, 
                            item.name || item.id, 
                            item.default||'', 
                            item.messages, 
                            (Array.isArray(item.validators) && item.validators.length>0), 
                            false));
      });
    }
    setState({items: model, valid: validateForm(model)});
    console.log(state);
  }, [schema]);

  const updateItem = (id:string, name: string, value:any, messages:string[], hasValidation:boolean, touched:boolean) => {
    console.log('Update Item,')
    const items = saveIntoArray(getItem(id, name, value, messages,hasValidation, touched), state.items, 'id')
    setState({
      items: items,
      valid: validateForm(items)
    });
  }



  const getItem = ( id:string, 
                    name: string, 
                    value:string, 
                    messages: string[] = [], 
                    hasValidation: boolean,
                    dirty:boolean): FormValueItem => {
    const errors: string[] = validate(id, value);
    console.log({ id, name, value, messages, errors, dirty })
    return { id, name, value, messages, errors, hasValidation, dirty }
  }

  const validate = (id:string, value:string): string[] => {
    const item:FormItem = findById(id, schema, 'id');
    if(!item.validators)
      item.validators = [];

    const messages: string[] = [];
    item.validators.forEach((val:ValidatorItem) => {
      if(val.type === 'isEmpty') {
        if(validator.isEmpty(value)){
          messages.push(val.message || 'Value cannot be empty')
        }
      }
      if(val.type === 'isLength'){
        if(!validator.isLength(value, val.options)){
          messages.push(val.message || 'Value length is not valid');
        }
        /*
        if(!val.options)
          throw new Error("isLength validator requires min, max props");
        if(!val.options.min) 
          val.options.min = 0; //min can default to 0
        if(!val.options.max) 
          throw new Error("isLength validator requires max props");
        */
      }
    });

    //lastly check the whole form

    //if(messages.length === 0)
    //  validateForm();

    return messages;
  }


  const submit = (event) => {
    event.preventDefault();
    submitFunction(state.items);
    console.log(state);
  }

  const validateForm = (items = state.items) => {
    let errors = 0;
    items.forEach(item => {
      errors += item.errors.length;
    });

    return errors === 0;
  }
  

  return (
    <form onSubmit={submit}>
    { Object.values(state.items).map((i) => (
      <MyInput key={i.id} data={i} updateFunction={updateItem} />
    ))}
    <IonItem key={'submitItem'}>
        <IonButton  
            onClick={submit} 
            disabled={!state.valid}
            color="primary">Save</IonButton>
    </IonItem>
    </form>
  )
};

export default MyForm;



/*
  const attachToForm = (component) => {
    setInputs({...inputs, ...{[component.props.name]: component}});
    setModel({...model, ...{[component.props.name]: component.state.value}});
  };

  const detachFromForm = (component) => {
    const i = Object.assign({}, inputs);
    delete i[component.props.name]
    setInputs(i);

    const m = Object.assign({}, model);
    delete m[component.props.name];
    setModel(m);
  }

  const updateModel = () => {
    const m = Object.assign({}, model);
    Object.keys(inputs).forEach((name) => {
      m[name] = inputs[name].state.value;
    });

    setModel(m);
  }

  const submit = (event) => {
    event.preventDefault();
    updateModel();
    console.log(model);
  }

  const getElement = (type) => {
    if(type === 'string'){
      return (
        <div>type</div>
      )
    }
  }
*/