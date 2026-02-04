const API_URL = import.meta.env.VITE_API_URL || '';

function getAuthHeaders(apartmentId?: number | null): HeadersInit {
   const token = localStorage.getItem('token');
   const headers: HeadersInit = {
      'Content-Type': 'application/json',
   };
   if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
   }
   if (apartmentId != null) {
      (headers as Record<string, string>)['X-Apartment-Id'] = String(apartmentId);
   }
   return headers;
}

export function getCurrentApartmentId(): number | null {
   const id = localStorage.getItem('currentApartmentId');
   if (id == null) return null;
   const n = Number(id);
   return Number.isInteger(n) ? n : null;
}

export function setCurrentApartmentId(id: number | null) {
   if (id == null) localStorage.removeItem('currentApartmentId');
   else localStorage.setItem('currentApartmentId', String(id));
}

export const get = async (path: string, options?: { apartmentId?: number | null }) => {
   const res = await fetch(API_URL + path, {
      headers: getAuthHeaders(options?.apartmentId ?? getCurrentApartmentId()),
   });
   const data = await res.json().catch(() => ({}));
   if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentApartmentId');
      window.dispatchEvent(new Event('auth:logout'));
   }
   if (!res.ok) throw new Error(data.message || 'Request failed');
   return data;
};

export const post = async (
   path: string,
   obj: object,
   options?: { apartmentId?: number | null },
) => {
   const res = await fetch(API_URL + path, {
      method: 'POST',
      headers: getAuthHeaders(options?.apartmentId ?? getCurrentApartmentId()),
      body: JSON.stringify(obj),
   });
   const data = await res.json().catch(() => ({}));
   if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentApartmentId');
      window.dispatchEvent(new Event('auth:logout'));
   }
   if (!res.ok) throw new Error(data.message || 'Response is not OK');
   return data;
};

export const patch = async (path: string, obj: object) => {
   const res = await fetch(API_URL + path, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(obj),
   });
   const data = await res.json().catch(() => ({}));
   if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentApartmentId');
      window.dispatchEvent(new Event('auth:logout'));
   }
   if (!res.ok) throw new Error(data.message || 'Request failed');
   return data;
};

export const del = async (path: string, options?: { apartmentId?: number | null }) => {
   const res = await fetch(API_URL + path, {
      method: 'DELETE',
      headers: getAuthHeaders(options?.apartmentId ?? getCurrentApartmentId()),
   });
   const data = await res.json().catch(() => ({}));
   if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentApartmentId');
      window.dispatchEvent(new Event('auth:logout'));
   }
   if (!res.ok) throw new Error(data.message || 'Response is not OK');
   return data;
};
