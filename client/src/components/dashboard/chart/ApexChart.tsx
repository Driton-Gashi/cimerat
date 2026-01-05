import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Cimer, Payment } from '../../../libs/types';
import { get } from '../../../libs/api';

type Series = { name: string; data: number[] };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ApexChart = () => {
   const [cimerat, setCimerat] = useState<Cimer[]>([]);
   const [payments, setPayments] = useState<Payment[]>([]);

   useEffect(() => {
      let ignore = false;
      const load = async () => {
         try {
            const [cimeratRaw, paymentsRaw] = await Promise.all([
               get('/cimerat'),
               get('/payments'),
            ]);

            if (ignore) return;

            setCimerat(cimeratRaw);
            setPayments(paymentsRaw);
         } catch (error) {
            console.error(error);
         }
      };
      load();
      return () => {
         ignore = true;
      };
   }, []);

   const series: Series[] = useMemo(() => {
      return cimerat.map((c) => {
         const totals = Array(12).fill(0);

         for (const p of payments) {
            if (p.payer_id !== c.id) continue;

            const d = new Date(p.transaction_date);
            if (Number.isNaN(d.getTime())) continue; // invalid date guard

            const month = d.getMonth(); // 0..11
            const amount = Number(p.amount);
            totals[month] += Number.isFinite(amount) ? amount : 0;
         }

         return { name: c.name, data: totals };
      });
   }, [cimerat, payments]);

   const options: ApexOptions = {
      chart: { type: 'area', height: 350 },
      dataLabels: { enabled: true },
      stroke: { curve: 'smooth' },
      xaxis: { categories: MONTHS },
      tooltip: { x: { formatter: (val) => String(val) } },
   };

   // Optional: if you want to avoid rendering the chart until you at least have cimerat
   // if (!cimerat.length) return <div>No data</div>;

   return <ReactApexChart options={options} series={series} type="area" height={350} />;
};

export default ApexChart;
