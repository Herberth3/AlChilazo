import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'TOP 5 de los mejores deliverys',
        },
    },
};


export const TopDeliveryReport = (props) => {

    const labels = props.deliveryReport.labels;

    const data = {
        labels,
        datasets: [
            {
                label: 'Total Puntos',
                data: props.deliveryReport.dataPoints,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Cantidad Envios',
                data: props.deliveryReport.dataShipments,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    return (
        <>
            <div className='container mt-5 w-75'>
                <Bar options={options} data={data} />;
            </div>
        </>
    )
}

