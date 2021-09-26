export const isLikeName = (filterName) => 
  (name) => 
    filterName ? new RegExp(filterName, 'i').test(name) : true;

export const isInArray = (filterArray) => 
  (el) => 
    (filterArray == null ? false : filterArray.length) ? filterArray.includes(el) : true;

export const isValue = (filterValue) => 
  (value) => 
    (filterValue == null || filterValue == '') ? true : value == filterValue;