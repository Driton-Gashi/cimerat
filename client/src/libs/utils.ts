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
