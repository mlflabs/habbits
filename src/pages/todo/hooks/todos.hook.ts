import { useEffect, useState, useRef } from 'react';
import { Subscription } from 'rxjs';
import { Doc, ProjectItem } from '../../../modules/data/models';
import { Todo } from '../models';
import { TodoService, TodoState, getInitTodoState } from '../todo.service';


export interface DataFunctions {
  save: {(doc: Todo):any},
  remove: {(id: string)},
  select: {(doc: Todo)},
  selectTag: {(tag: string)},
  changeDoneFilter: {(done:boolean)}
}


//more simpler then auth hook, just read data
export function useTodosCollectionFacade(project: ProjectItem): 
                                        [TodoState, DataFunctions]{

  const [state, setState] = useState(getInitTodoState());

  const todoService = useRef(new TodoService());
  
          
  const dataFunctions = {
    save: (doc: Todo) => todoService.current.save(doc),
    remove: (id) => todoService.current.remove(id), //TODO: allow user to choose, sync or not to sync
    select: (doc: Todo) => todoService.current.select(doc),
    selectTag: (tag: string) => todoService.current.selectTag(tag),
    changeDoneFilter: (done:boolean) => todoService.current.changeDoneFilter(done),
  }

  useEffect(() => {
    console.log('TODOS HOOK - UseEffect NEW SERVICE------------------------------');
    todoService.current.init(project)

    return todoService.current.unsubscribe;
  }, [project._id])

  useEffect(() => {
    const subscriptions: Subscription[] = [
      todoService.current.state$.subscribe(state => {
        console.log('TODO Hook Sub: ', state);
        setState(state);
      })
    ];
    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[project._id]);


  return [state, dataFunctions];
}