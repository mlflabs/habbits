


export const waitMS = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function generateShortUUID(): string {
  let d = Date.now();

  const uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // tslint:disable-next-line:no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line:no-bitwise
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function generateUUID(): string {
  let d = Date.now();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // tslint:disable-next-line:no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line:no-bitwise
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
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