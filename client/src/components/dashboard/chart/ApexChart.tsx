import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const ApexChart = () => {
   const [state, _setState] = useState<{ series: ApexAxisChartSeries; options: ApexOptions }>({
      series: [
         {
            name: 'Driton',
            data: [10, 11, 12, 13, 14, 20, 100],
         },
         {
            name: 'Diar',
            data: [11, 32, 45, 32, 34, 52, 41],
         },
      ],
      options: {
         chart: {
            height: 350,
            type: 'area',
         },
         dataLabels: {
            enabled: true,
         },
         stroke: {
            curve: 'smooth',
         },
         xaxis: {
            type: 'datetime',
            categories: [
               '2025-01-1',
               '2025-02-1',
               '2025-03-1',
               '2025-04-1',
               '2025-05-1',
               '2025-06-1',
               '2025-07-1',
               '2025-08-1',
               '2025-09-1',
               '2025-10-1',
               '2025-11-1',
               '2025-12-1',
            ],
         },
         tooltip: {
            x: {
               format: 'dd/MM/yy HH:mm',
            },
         },
      },
   });

   return (
      <div>
         <div id="chart">
            <ReactApexChart
               options={state.options}
               series={state.series}
               type="area"
               height={350}
            />
         </div>
         <div id="html-dist"></div>
      </div>
   );
};

export default ApexChart;
