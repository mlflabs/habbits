const nanoid = require('nanoid');

export function getNested(obj, ...args) {
  return args.reduce((obj, level) => obj && obj[level], obj)
}

export const waitMS = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function generateShortUUID(): string {
  return 'i'+nanoid();
}



export function generateUUID() { // Public Domain/MIT
  return 'id'+nanoid();
}





export function saveIntoArray(item: Object, ary: Array<any> = [], idKey: string = '_id'): Array<any> {
  let i = getIndexById(item[idKey], ary, idKey);
  if (i === -1) {
    i = ary.length;
  }
  return [...ary.slice(0, i),
          Object.assign({}, item),
          ...ary.slice(i + 1)];
}

export function getIndexById(id: string, ary: any, idKey: string = '_id'): number {
  for (let i = 0; i < ary.length; i++) {
    if (id === ary[i][idKey]) {
      return i;
    }
  }
  return -1;
}

export function findById(id:any, ary: any[], idKey: string = "_id"): any {
  for (let i = 0; i < ary.length; i++) {
    if (id === ary[i][idKey]) {
      return ary[i];
    }
  }
  return null;
}

export function removeFromArrayById(id: any, ary:Array<any>, idKey = '_id') {
  return ary.filter(o => o[idKey] !== id);
}