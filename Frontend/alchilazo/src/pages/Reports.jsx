import React from 'react'
import { NavbarAdmin } from '../components/Admin/NavbarAdmin'
import { dataReport } from '../services/DataReports';
import { useState } from 'react';
import HttpClientService from '../services/HttpClientService';
import Swal from 'sweetalert2';
import UsersReport from '../components/Admin/UsersReport';
import { TopDeliveryReport } from '../components/Admin/TopDeliveryReport';
import { TopCompanyReport } from '../components/Admin/TopCompanyReport';
import { TopSaleReport } from '../components/Admin/TopSaleReport';

export const Reports = () => {

    const [spinnerSearch, setSpinnerSearch] = useState(false)
    const [listReports, setListReports] = useState([])
    const [report, setReport] = useState({ idType: 0, idReport: 0 })
    const [userReport, setUserReport] = useState({ users: [], perDay: [], perMonth: [], perYear: [] })

    const [deliveryReport, setDeliveryReport] = useState({ labels: [], dataPoints: [], dataShipments: [] })
    const [companyReport, setCompanyReport] = useState({ labels: [], total: [] })
    const [saleReport, setSaleReport] = useState([])


    const handleTypeChange = (e) => {
        const selectedType = parseInt(e.target.value);
        setReport({ ...report, idType: selectedType, idReport: 1 });

        const dataTmp = dataReport.filter((e) => e.id == selectedType)
        setListReports(dataTmp[0].reports)
    };


    const searchRepot = () => {
        console.log('dATA: ', report);
        setSpinnerSearch(true)

        if (report.idType == 2) {

            clearArrays()
            const httpClientService = new HttpClientService()
            httpClientService.post('admin/report/usersReport', report).then(res => {
                if (!res.error) {
                    setUserReport(res)
                    setSpinnerSearch(false)
                    Swal.fire({ title: 'Reporte generado correctamente', icon: 'success' })
                } else {
                    setSpinnerSearch(false)
                    Swal.fire({ title: res.error, icon: 'error' })
                }
            })
        } else if (report.idType == 3) {

            clearArrays()
            const httpClientService = new HttpClientService()
            httpClientService.post('admin/report/topDeliveryReport', report).then(res => {
                if (!res.error) {
                    setDeliveryReport(res)
                    setSpinnerSearch(false)
                    Swal.fire({ title: 'Reporte generado correctamente', icon: 'success' })
                } else {
                    setSpinnerSearch(false)
                    Swal.fire({ title: res.error, icon: 'error' })
                }
            })
        } else if (report.idType == 1) {

            clearArrays()
            const httpClientService = new HttpClientService()
            if (report.idReport == 1) {
                httpClientService.post('admin/report/topCompanyReport', report).then(res => {
                    if (!res.error) {
                        setCompanyReport(res)
                        setSpinnerSearch(false)
                        Swal.fire({ title: 'Reporte generado correctamente', icon: 'success' })
                    } else {
                        setSpinnerSearch(false)
                        Swal.fire({ title: res.error, icon: 'error' })
                    }
                })
            } else if (report.idReport == 2) {
                httpClientService.post('admin/report/saleReport', report).then(res => {
                    if (!res.error) {
                        setSaleReport(res)
                        setSpinnerSearch(false)
                        Swal.fire({ title: 'Reporte generado correctamente', icon: 'success' })
                    } else {
                        setSpinnerSearch(false)
                        Swal.fire({ title: res.error, icon: 'error' })
                    }
                })
            }
        } else {
            setSpinnerSearch(false)
            Swal.fire({ title: 'Seleccione una opcion', icon: 'info' })
        }
    }

    const clearArrays = () => {
        setUserReport({ users: [], perDay: [], perMonth: [], perYear: [] })
        setDeliveryReport({ labels: [], dataPoints: [], dataShipments: [] })
        setCompanyReport({ labels: [], total: [] })
        setSaleReport([])
    }

    return (
        <>
            <NavbarAdmin />
            <div className='container mt-4'>
                <div className='d-flexs row'>
                    <select defaultValue={report.idType} onChange={handleTypeChange} className="form-select me-2 col" aria-label="Default select example">
                        <option value={0} disabled>Seleccione un tipo de reporte</option>
                        {dataReport.map((item, index) => (
                            <option key={index} value={item.id}>{item.type}</option>
                        ))}
                    </select>
                    <select defaultValue={report.idReport} onChange={(e) => setReport({ ...report, idReport: parseInt(e.target.value) })} className="form-select col" aria-label="Default select example">
                        <option value={0} disabled>Seleccione un reporte</option>
                        {listReports.map((item, index) => (
                            <option key={index} value={item.id}>{item.type}</option>
                        ))}
                    </select>
                    <div className='col'>
                        <button disabled={spinnerSearch} type="button" className='btn btn-dark' onClick={searchRepot}> <i className="fa-solid fa-magnifying-glass me-2"></i>
                            Buscar
                            {spinnerSearch && <div class="spinner-border spinner-border-sm ms-2" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>}
                        </button>
                    </div>
                </div>
                {userReport.users.length > 0 && <UsersReport userReport={userReport} />}
                {deliveryReport.labels.length > 0 && <TopDeliveryReport deliveryReport={deliveryReport} />}
                {companyReport.labels.length > 0 && <TopCompanyReport companyReport={companyReport} />}
                {saleReport.length > 0 && <TopSaleReport saleReport={saleReport} />}
            </div>
        </>
    )
}
