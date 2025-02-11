export const setStorageObject = (key, obj) => {
   localStorage.setItem(key, JSON.stringify(obj));
};

export const getStorageObject = (key) => {
   const item = localStorage.getItem(key);
   return item ? JSON.parse(item) : null;
};

export const deleteStorageObject = (key) => {
   localStorage.removeItem(key);
}


