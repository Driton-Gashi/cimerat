export const get = async (path: string) => {
   const API_URL = import.meta.env.VITE_API_URL;
   const res = await fetch(API_URL + path);
   if (!res.ok) throw new Error('Response is not OK');
   const data = await res.json();
   return data;
};

export const post = async (path: string, obj: object) => {
   const API_URL = import.meta.env.VITE_API_URL;
   const res = await fetch(API_URL + path, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
   });
   if (!res.ok) throw new Error('Response is not OK');

   const data = await res.json();
   return data;
};
