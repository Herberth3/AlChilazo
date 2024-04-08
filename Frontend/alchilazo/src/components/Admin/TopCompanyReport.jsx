import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'TOP 5 de las empresas que mas pedidos generan',
        },
    },
};


export const TopCompanyReport = (props) => {

    const data = {
        labels: props.companyReport.labels,
        datasets: [
            {
                label: 'Total de pedidos',
                data: props.companyReport.total,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };


    return (
        <>
             <div className='container mt-5 w-50'>
                <Pie options={options} data={data} />
            </div>
        </>

    )
}
