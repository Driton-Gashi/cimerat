export const formatCurrency = (value: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
   }).format(value);
};

export const formatDate = (isoOrDateString: string) => {
   const d = new Date(isoOrDateString);
   if (Number.isNaN(d.getTime())) return isoOrDateString;
   return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   }).format(d);
};

export const isInThisWeekMondayStart = (isoDate: string, now = new Date()) => {
   const d = new Date(isoDate);

   const startOfToday = new Date(now);
   startOfToday.setHours(0, 0, 0, 0);

   const day = startOfToday.getDay();
   const mondayOffset = (day + 6) % 7;

   const startOfWeek = new Date(startOfToday);
   startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);

   const startOfNextWeek = new Date(startOfWeek);
   startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

   return d >= startOfWeek && d < startOfNextWeek;
};
