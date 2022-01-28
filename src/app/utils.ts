export function removeArrayDoubles(array: any[]): any[] {
  return [...new Set(array)];
}

export function deepcopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
  // return Object.assign({}, obj);
}

export function removeMatchedIdFromArray(array: any[], obj: any): any[] {
  // remove the elements from an array that have the same id value as an
  // object
  return array.filter(function (elem: any) {
    return elem.id !== obj.id;
  });
}

export function getById(array: any[], id: number): any {
  return array.find((x) => x.id === id);
}

export function getIdsFromArray(array: any[]): number[] {
  return array.map((a) => {
    return a.id;
  });
}

export function arrayContainsObjWithId(id: number, array: any[]) {
  return array.some((u) => u.id === id);
}

export function containsObject(obj: any, list: any[]) {
  // check if list of objects contains a specific object
  for (let i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}

export function isSubset(small_array: any[], large_array: any[]) {
  return small_array.every((val) => large_array.includes(val));
}