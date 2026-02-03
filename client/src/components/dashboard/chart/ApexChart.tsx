import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Payment } from '../../../libs/types';
import { get } from '../../../libs/api';
import { useAuth } from '../../../context/AuthContext';

type Series = { name: string; data: number[] };

type ApartmentMember = {
   user_id: number;
   role: string;
   joined_at: string;
   name: string;
   lastname: string;
   email: string;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const currentYear = new Date().getFullYear();

const ApexChart = () => {
   const { currentApartmentId } = useAuth();
   const [members, setMembers] = useState<ApartmentMember[]>([]);
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!currentApartmentId) {
         setLoading(false);
         return;
      }
      let ignore = false;
      const load = async () => {
         setLoading(true);
         setError(null);
         try {
            const [membersRaw, paymentsRaw] = await Promise.all([
               get(`/apartments/${currentApartmentId}/members`),
               get('/payments'),
            ]);

            if (ignore) return;

            setMembers(Array.isArray(membersRaw) ? membersRaw : []);
            setPayments(Array.isArray(paymentsRaw) ? paymentsRaw : []);
         } catch (err) {
            if (!ignore) {
               console.error(err);
               setError('Failed to load chart data.');
            }
         } finally {
            if (!ignore) setLoading(false);
         }
      };
      load();
      return () => {
         ignore = true;
      };
   }, [currentApartmentId]);

   const series: Series[] = useMemo(() => {
      const paymentsThisYear = payments.filter((p) => {
         const d = new Date(p.transaction_date);
         return !Number.isNaN(d.getTime()) && d.getFullYear() === currentYear;
      });

      return members.map((member) => {
         const totals = Array(12).fill(0);

         for (const p of paymentsThisYear) {
            if (p.payer_id !== member.user_id) continue;
            const d = new Date(p.transaction_date);
            const month = d.getMonth();
            const amount = Number(p.amount);
            totals[month] += Number.isFinite(amount) ? amount : 0;
         }

         const displayName = [member.name, member.lastname].filter(Boolean).join(' ') || 'Member';
         return { name: displayName, data: totals };
      });
   }, [members, payments]);

   const options: ApexOptions = useMemo(
      () => ({
         chart: {
            type: 'area',
            height: 350,
            toolbar: { show: true },
            zoom: { enabled: false },
         },
         dataLabels: { enabled: false },
         stroke: { curve: 'smooth', width: 2 },
         fill: {
            type: 'gradient',
            gradient: {
               shadeIntensity: 1,
               opacityFrom: 0.4,
               opacityTo: 0.1,
            },
         },
         xaxis: {
            categories: MONTHS,
            title: { text: 'Month' },
         },
         yaxis: {
            title: { text: 'Amount (€)' },
            labels: {
               formatter: (val: number) => (val === 0 ? '0' : `€${val}`),
            },
         },
         tooltip: {
            y: {
               formatter: (val: number) => (Number.isFinite(val) ? `€${val}` : '0'),
            },
         },
         legend: {
            position: 'top',
            horizontalAlign: 'right',
         },
         title: {
            text: `Payments by member (${currentYear})`,
            align: 'left',
            style: { fontSize: '14px' },
         },
      }),
      [],
   );

   if (loading) {
      return (
         <div className="apex-chart-placeholder" style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading chart...
         </div>
      );
   }

   if (error) {
      return (
         <div className="apex-chart-placeholder" style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error, #c00)' }}>
            {error}
         </div>
      );
   }

   if (!currentApartmentId || members.length === 0) {
      return (
         <div className="apex-chart-placeholder" style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #666)' }}>
            No apartment or members to show.
         </div>
      );
   }

   const hasAnyData = series.some((s) => s.data.some((v) => v > 0));
   if (!hasAnyData) {
      return (
         <div className="apex-chart-placeholder" style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #666)' }}>
            No payments this year yet.
         </div>
      );
   }

   return <ReactApexChart options={options} series={series} type="area" height={350} />;
};

export default ApexChart;
