
import { Todo, TYPE_TODO } from './models';
import { BehaviorSubject } from 'rxjs';
import { dataService } from '../../modules/data/dataService';
import { saveIntoArray } from '../../modules/data/utilsData';
import { ProjectItem } from '../../modules/data/models';



export interface TodoState {
  selectedTodo: Todo|null,
  selectedTag: string,
  docs: Todo[],
  tags: string[],
  doneTodos: boolean
}

export const getInitTodoState = (): TodoState => {
  return {
    selectedTodo:null,
    selectedTag: 'all',
    docs: [],
    tags: ['today', 'important', 'all'],
    doneTodos: false,
  }
}


export class TodoService {

  private _project: ProjectItem;

  private _state: TodoState = getInitTodoState();
  
  public state$ = new BehaviorSubject(this._state);

  private _docs: Todo[];
  
  public docs$ = new BehaviorSubject(this._docs);

  private _subscription = [];

  constructor() {
    // this.loadQueryViews();
  }


  public init(project: ProjectItem) {
    const sub = dataService.pouchReady$.subscribe(ready => {
      if(ready) this._init(project);
    });
    this._subscription.push(sub);
  }

  async _init(project: ProjectItem) {
    console.log("Init: ", project, TYPE_TODO);
    if(this._project && this._project._id === project._id) return;

    this._project = project;
    this._docs = await dataService.getAllByProjectAndType(project.childId, TYPE_TODO);
    console.log("Init Docs: ", this._docs);
    this.filterTodos();

    //manage changes

    const sub = dataService.subscribeProjectCollectionChanges(project.childId,TYPE_TODO)
      .subscribe(doc => {
        console.log("TodoService subscription: ", doc);
        if(doc._deleted)
          this._docs = this._docs.filter(d => d._id !== doc._id);
        else
          this._docs = saveIntoArray(doc, this._docs);

        this.filterTodos();
        //TODO: need to optimize this, maybe start using the view query, see bottom of file
      });
    this._subscription.push(sub);
  }



  private filterTodos() {
    console.log("FilterTodos", this._docs);
    const filtered = this._docs.filter(doc => this.filterFunction(doc));
    this.state = {...this._state, ...{docs: filtered}};
    console.log("Filtered State: ", this._state);
  }

  private filterFunction(doc:Todo) {
      if (doc.done !== this._state.doneTodos) return false;
      if(this._state.selectedTag === 'all') return true;
      if(!doc.tags) return false;

      for(let i = 0; i < doc.tags.length; i++){
        if(doc.tags[i] === this._state.selectedTag)
          return true;
      }
      return false;
    
  }



  public get state(): TodoState {
    return this._state;
  }
  public set state(value: TodoState) {
    this._state = value;
    this.state$.next(this._state);
  }

  public get docs(): Todo[] {
    return this._docs;
  }
  public set docs(value: Todo[]) {
    this._docs = value;
    this.docs$.next(this._docs);
  }



  public save(doc:Todo) {
    console.log("Save: ", doc, this._project, TYPE_TODO);
    dataService.saveInProject({...{done: false}, ...doc}, this._project, TYPE_TODO, null, null, true, true);
  }

  public remove(id: string) {
    dataService.remove(id, true);
  }

  public select(doc:Todo) {
    this.state = {...this._state, ...{ selectedTodo: doc} };
  }

  public changeDoneFilter(done: boolean) {
    if(done === this._state.doneTodos) return;
    this._state = {...this._state, ...{ doneTodos: done} };
    this.filterTodos();

  }

  public selectTag(tag:string) {
    if(tag === this._state.selectedTag) return;
    this._state = {...this._state, ...{ selectedTag: tag} };
    this.filterTodos();
  }


  public unsubscribe() {
    this._subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

/*
  //load views/indexes
  private loadQueryViews() {
     // add view filters
     dataService.pouch.put({
      _id: '_design/todo_index',
      views: {
        by_tag: {
          map: function (doc) {
            var i = doc._id.indexOf('|');
            i = id.indexOf('|', i+1)
            i = id.indexOf('|', i+1)
            var id = doc._id.substring(0, i+1);
            var done;
            if(doc.todoDone){
              done = 1;
            }
            else {
              done = 0;
            }
            // for 'all' tag
            emit(done + id + 'all|');
            //for all the other tags
            if(doc.tags){
              for(var ii = 0; ii < doc.tags.length; ii++){
                emit(done + id + doc.tags[ii] + '|');
              }
            }
            
          }.toString()
        }
      }
    }).then((res) => {
      console.log(res);
    }).catch((err)=> {
      console.log(err);
    });
  }
*/

}



export  const todoService = new TodoService();