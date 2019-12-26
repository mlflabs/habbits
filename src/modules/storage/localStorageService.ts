

class LocalStorageService {

  constructor(platform = 'web') {

  }
  
  async getItem(id: string){
    return localStorage.getItem(id);
  }

  async getString(id: string):Promise<string>{
    let val:string;
    val = localStorage.getItem(id) || '';
    return val;
  }

  async getObject(id: string):Promise<object|null> {
    const val = localStorage.getItem(id);
    if(!val)return null;
    return JSON.parse(val);

  }



  async setItem(id: string, val: string) {
    localStorage.setItem(id, val);
  }
  
}

const localStorageService = new LocalStorageService();

export default localStorageService;