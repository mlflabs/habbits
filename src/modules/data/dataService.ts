import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, debounceTime, filter } from 'rxjs/operators';
import { generateShortUUID, generateUUID } from './utilsData';
import { isEqual } from 'lodash';

import ulog from 'ulog'
import { ProjectItem, PROJECT_SERVICE, DIV, PROJECT_INDEX_SERVICE, LASTCHAR } from './models';
import { env } from '../../env';
import { waitMS } from '../../utils';
const log = ulog('service:data')

export function generateShortCollectionId(prefix: string = ''): string {
  return prefix + '|' + generateShortUUID();
}

export function generateCollectionId(prefix: string = ''): string {
  return prefix + '|' + generateUUID();
}

PouchDB.plugin(PouchDBFind);

class DataService {
  private _pouch: any;
  private _replicateToSubscripiton;
  private _replicateFromSubscription;
  private _changesSubscription;

  public get pouch(): any {
    return this._pouch;
  }

  private authToken: string = '';
  private authUsername: string = '';
  private _ready = false;
  public pouchReady$ = new BehaviorSubject(this.ready);

  public addSyncCall$ = new Subject(); // do we need to sync with server
  private _changes = new Subject();


  private _localPouchOptions = {
    revs_limit: 5,
    auto_compaction: true
  };


  constructor() {
    

    //subscriptions
    this.addSyncCall$.pipe(
      debounceTime(1000),
    ).subscribe(() => {
        this._syncRemote(this.authToken);
      })
  }

  // access
  async getDoc(id: string, attachments = false, opts = {}): Promise<any> {
    console.log('GET DOC: ', id);
    try {
      const doc = await this._pouch.get(id, { ...{ attachments: attachments }, ...opts });
      console.log('Get Doc Loaded: ', doc);
      return doc;
    }
    catch (e) {
      console.log('Get Doc Error: ', id, e);
      return null;
    }
  }


  async getImage(id, name) {
    const img = this._pouch.getAttachment(id, name);
    return img;
  }

  async findDocsByProperty(value, prop: string): Promise<any> {
    try {

      const query = { [prop]: { $eq: value } };
      console.log('Query: ', query);


      const docs = await this._pouch.find({
        selector: {
          [prop]: { $eq: value }
        }
      });

      return docs.docs;
    }
    catch (e) {
      console.log('Error finding docs by property: ', e, value, prop);
      return [];
    }
  }


  async getAllDocs() {
    const res = await this._pouch.allDocs({ include_docs: true });
    const docs = res.rows.map(row => row.doc);
    return docs;
  }

  async getProjectFromChildId(id) {
    const pid = PROJECT_SERVICE + DIV + PROJECT_INDEX_SERVICE + DIV + id.split('|')[1];
    console.log('GetPRojectFromChildID ID: ', pid);
    const doc = await this.getDoc(pid);
    console.log('Project:: ', doc);
    return doc;
  }

  async getAllByProjectAndType(projectChildId, type, attachments = false) {
    console.log(projectChildId, type, attachments);
    console.log(projectChildId + DIV + type + DIV);
    console.log(projectChildId + DIV + type + DIV + LASTCHAR);
    const res = await this._pouch.allDocs({
      include_docs: true,
      attachments: attachments,
      startkey: projectChildId + DIV + type + DIV,
      endkey: projectChildId + DIV + type + DIV + 'z'
    });
    const docs = res.rows.map(row => row.doc);
    console.log(res);


    const test = await this.getAllDocs();
    console.log(test);
    console.log(projectChildId + DIV + type + DIV);
    console.log(projectChildId + DIV + type + DIV + LASTCHAR);
    console.log(res);

    const res3 = await this._pouch.allDocs({
      include_docs: true,
      attachments: attachments,
      startkey: projectChildId + DIV + type + DIV,
      endkey: 'z'
    });

    console.log(res3);




    return docs;
  }


  // modify

  async save(doc, collection: string = '', old = null, attachment: any = null, syncRemote = true): Promise<any> {
    // if its a design doc, or query, skip it
    if (doc._id != null && doc._id.startsWith('_')) {
      return false;
    }
    let oldDoc = {};

    if (doc._id && old == null) {
      oldDoc = await this._pouch.get(doc._id);
    }

    console.log('Checking if no changes made: ', oldDoc);
    if (isEqual(oldDoc, doc)) {
      console.log('No changes, skip saving');
      return false; // we have no need to save, maybe here we need something else, like a message
    }

    let res;
    try {
      doc.updated = Date.now();

      if (doc._id == null) {
        doc._id = generateCollectionId(collection);
      }

      res = await this._pouch.put({ ...oldDoc, ...doc });

      //see if we have an attachment
      if (attachment) {
        //TODO:: use attachment.size to restrict big files
        res = await this._pouch.putAttachment(doc._id, 'file', res.rev, attachment, attachment.type);
      }

      if (syncRemote)
        this.addSyncCall$.next();

      console.log('Saved doc: ', res);
      if (res.ok)
        return res;
      else
        return false;
    }
    catch (e) {
      console.log('Save Pouch Error: ', e);
      return false;
    }
  }

  getDefaultProject() {
    const uuid = 'u-' + this.authUsername;
    return {
      _id: PROJECT_SERVICE + '|' + PROJECT_INDEX_SERVICE + '|' + uuid,
      childId: PROJECT_SERVICE+ '|' + uuid,
      user: this.authUsername,
      meta_access: [ 'u|' + this.authUsername, ], 
    }
  }

  async saveNewProject(doc, syncRemote = true): Promise<any> {
    const uuid = generateShortUUID();
    doc._id = PROJECT_SERVICE + '|' + PROJECT_INDEX_SERVICE + '|' + uuid;
    doc.childId = PROJECT_SERVICE+ '|' + uuid;
    doc.user = this.authUsername;
    doc.meta_access = [ 'u|'+ this.authUsername + '|' + uuid, ]; 

    try {
      const res = await this._pouch.put(doc);

      if(syncRemote) this.addSyncCall$.next();

      return res;
  }
    catch(e){
      console.log('Error saving new project: ', e);
      return false;
    }

  }


  public async saveInProject(doc,
    project: ProjectItem = new ProjectItem(),
    collection: string = '',
    oldDoc = null,
    attachment: any = null,
    syncRemote = true,
    forceSave = false): Promise<any> {

    // if its a design doc, or query, skip it
    if (doc._id != null && doc._id.startsWith('_')) {
      return false;
    }

    log.trace('Saving Doc: ', doc, project, collection, oldDoc);

    // see if we need to compare changes and only save if there are any
    // lets see if there are actual changes
    // Here we can also load an old doc, see if it exists
    if (!oldDoc && doc._id) {
      try {
        //see if we have old doc.
        oldDoc = await this._pouch.get(doc._id);
      }
      catch (e) {

      }
    }

    if (oldDoc != null) {
      if (isEqual(oldDoc, doc)) {
        return false; // we have no need to save, maybe here we need something else, like a message
      }

      if(forceSave){
        doc._rev = oldDoc._rev;
      }
    }

    //make sure access is same as project
    doc.meta_access = project.meta_access;

    let res;
    try {
      doc.updated = Date.now();

      if (doc._id == null) {
        doc._id = project.childId + '|' + generateShortCollectionId(collection);
        res = await this._pouch.put(doc);
      }
      else {
        res = await this._pouch.put(Object.assign(oldDoc, doc));
      }

      //see if we have an attachment
      if (attachment) {
        //TODO:: use attachment.size to restrict big files
        res = await this._pouch.putAttachment(doc._id, 'file', res.rev, attachment, attachment.type);
      }

      if (syncRemote)
        this.addSyncCall$.next();

      log.trace('Saved doc: ', res);

      if (res.ok)
        return res;
      else
        return false;
    }
    catch (e) {
      console.log('Save Pouch Error: ', e);
      return false;
    }
  }


  public async remove(id, syncRemote = true) {
    try {
      if (typeof id !== 'string') {
        if (id) {
          if (id._id)
            id = id._id;
        }
      }
      const doc = await this._pouch.get(id);
      doc._deleted = true;
      doc.updated = Date.now();
      const res = await this._pouch.put(doc);

      if (syncRemote)
        this.addSyncCall$.next();

      if (res.ok)
        return res;
      else
        return false;
    }
    catch (e) {
      console.log('Remove Pouch Error:: ', e);
      return false;
    }
  }

  public async removeProject(project: ProjectItem, syncRemote = true) {
    try {
      //load all project children and remove them
      const res = await this._pouch.allDocs({
        include_docs: true,
        startkey: project.childId + DIV,
        endkey: project.childId + DIV + LASTCHAR
      });
      const docs = res.rows.map(row => Object.assign(
        row.doc, { _deleted: true, updated: Date.now() }));

      docs.push(Object.assign(project, { _deleted: true, updated: Date.now() }));
      const res2 = await this._pouch.bulkDocs(docs);

      if (syncRemote)
        this.addSyncCall$.next();

      return res2;
    }
    catch (e) {
      console.log('Remove Project Error: ', e);
    }
  }



  // streams
  subscribeChanges(): Observable<any> {
    return this._changes.asObservable().pipe(
      // debounceTime(1000),
      map(doc => {
        return doc;
      })
    );
  }

  subscribeDocChanges(id: string, debounce: number = 0): Observable<any> {
    return this._changes.asObservable().pipe(
      debounceTime(debounce),
      filter((doc: any) => doc._id === id)
    );
  }

  subscribeProjectsChanges(debounce: number = 0): Observable<any> {
    return this._changes.asObservable().pipe(
      debounceTime(debounce),
      filter((doc: any) => doc._id.startsWith(PROJECT_SERVICE + '|' + PROJECT_INDEX_SERVICE + '|'))
    );
  }

  subscribeProjectCollectionChanges(projectChildId: string,
    type: string,
    debounce: number = 0): Observable<any> {
    return this._changes.asObservable().pipe(
      debounceTime(debounce),
      filter((doc: any) => doc._id.startsWith(projectChildId + '|' + type + '|'))
    );
  }



  // internal
  public get ready() {
    return this._ready;
  }
  public set ready(value: boolean) {
    this._ready = value;
    this.pouchReady$.next(value);
  }



  public async init(username: string, authToken: string = '', syncRemote = false, mergeOldData = false) {
    console.log('InitPouch')
    //see if we already are loading this
    if(username === this.authUsername && authToken === this.authToken) return;

    if(this._replicateToSubscripiton)
      this._replicateToSubscripiton.cancel();
    if(this._replicateFromSubscription)
      this._replicateFromSubscription.cancel();
    if(this._changesSubscription)
      this._changesSubscription.cancel();


    console.log('-----------------',username, authToken)
    this.authToken = authToken;
    this.authUsername = username;
    //TODO: check if we need to destory the previous pouch
    try {
      await this.initPouch(env.APP_ID + username, syncRemote, mergeOldData);
      return true;
    }
    catch(e) {
      console.log(e);
      return false;
    }
  }

  public async clearPouchData() {
    //TODO: clear old data
  }

  public addIndex (fields:string[], indexName:string = '') {
    if(indexName === ''){
      this._pouch.createIndex({
        index: {fields: fields}
      }); 
    }
    else {
      this._pouch.createIndex({
        index: {
            fields: fields,
            ddoc: indexName}
      }); 
    }
        
  }
 

  private async initPouch(pouchName: string, syncRemote: boolean = false, mergeOldData: boolean = false) {
    this.ready = false;
    log.info('initDB name: ', pouchName);

    let oldDocs;
    if (mergeOldData && this._pouch) {
      oldDocs = await this.getAllDocs();
    }

    this._pouch = await new PouchDB(pouchName, this._localPouchOptions);
    window['PouchDB'] = this._pouch;

    // create our event subject
    this._pouch.changes({ live: true, since: 'now', include_docs: true })
      .on('change', change => {
        log.info('Pouch on change ', change);
        this._changes.next(change.doc);
      });

    if (syncRemote) {
      this.addSyncCall$.next();
    }

    if (mergeOldData && oldDocs) {
      oldDocs.forEach(d => {
        this.save(d);
      });
    }
    
    await waitMS(200);
    this.ready = true;

    return true;


  }



  private _syncRemote(token: string) {
    log.debug(env.COUCH_SERVER);

    const remoteDB = new PouchDB(env.COUCH_SERVER,
      { headers: { 'x-access-token': token } });

    const opts = {
      live: false,
      retry: false
    };
    this._replicateToSubscripiton =  this._pouch.replicate.to(remoteDB, opts);
    this._replicateFromSubscription = this._pouch.replicate.from(remoteDB, opts)
      .on('change', function (change) {
        log.trace('Remote Sync: ', change);
      }).on('error', function (err) {
        log.trace('Remote Error: ', err);
        // yo, we got an error! (maybe the user went offline?)
      }).on('complete', function () {
        log.trace('Remote Sync Completed ');
      }).on('paused', function (info) {
        log.trace('Remote Sync PAUSED: ', info);
        // replication was paused, usually because of a lost connection
      }).on('active', function (info) {
        log.trace('Remote Sync ACTIVE: ', info);
      });
  }


}

export const dataService = new DataService();

