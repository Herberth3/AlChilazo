import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { NavbarAdmin } from '../components/Admin/NavbarAdmin';
import HttpClientService from '../services/HttpClientService';

export const CompanyRequest = () => {

    const [deliveryRequest, setdeliveryRequest] = useState([])

    useEffect(() => {
        getDeliveryRequest()

        return () => {
        }

    }, [])

    const getDeliveryRequest = () => {
        const httpClientService = new HttpClientService()
        httpClientService.get('admin/deliveryRequest').then(res => {
            if (!res.error) {
                setdeliveryRequest(res.companies)
            } else { console.log('ERROR: ', res.error) }
        })
    }

    const approveRequest = (item) => {
        Swal.fire({
            icon: 'info',
            title: 'Aprobar la solicitud',
            text: '¿Desea aprobar la solicitud y notificar al correo proporcionado?',
            showCancelButton: true,
            confirmButtonText: 'Si, aprobar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {

                const httpClientService = new HttpClientService()
                httpClientService.post('admin/approveRequest', { id: item.idEmpresa, email: item.correo, estado: 1, approve: true, isCompany: true }).then(res => {
                    if (!res.error) {
                        getDeliveryRequest()
                        Swal.fire({ title: res.message, icon: 'success' })
                    } else {
                        getDeliveryRequest()
                        Swal.fire({ title: res.error, iccon: 'error' })
                    }
                })
            }
        })
    }

    const doNotApproveRequest = (item) => {
        Swal.fire({
            icon: 'info',
            title: 'No aprobar la solicitud',
            input: 'text',
            text: 'Escriba una justificacion:',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {

                const httpClientService = new HttpClientService()
                httpClientService.post('admin/approveRequest', { id: item.idEmpresa, email: item.correo, estado: 0, approve: false, justification: result.value + "", isCompany: true }).then(res => {
                    if (!res.error) {
                        getDeliveryRequest()
                        Swal.fire({ title: res.message, icon: 'success' })
                    } else {
                        getDeliveryRequest()
                        Swal.fire({ title: res.error, iccon: 'error' })
                    }
                })
            }
        })
    }

    return (
        <>
            <NavbarAdmin />
            <div className='container mt-2'>
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Email</th>
                            <th scope="col">Dirección</th>
                            <th scope="col">Municipio</th>
                            <th scope="col">Departamento</th>
                            <th scope="col">Autenticidad</th>
                            <th scope="col">Registro</th>
                            <th scope="col">Permiso sanitario</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryRequest.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.categorias}</td>
                                <td>{item.correo}</td>
                                <td>{item.direccion}</td>
                                <td>{item.municipio}</td>
                                <td>{item.departamento}</td>
                                <td><a href={item.urls.autenticidad} target="_blank"><i className="fa-solid fa-file-pdf" style={{ 'cursor': 'pointer' }}></i></a></td>
                                <td><a href={item.urls.permiso} target="_blank"><i className="fa-solid fa-file-pdf" style={{ 'cursor': 'pointer' }}></i></a></td>
                                <td><a href={item.urls.registro} target="_blank"><i className="fa-solid fa-file-pdf" style={{ 'cursor': 'pointer' }}></i></a></td>
                                <td>
                                    <button className='btn btn-outline-primary me-2' onClick={() => approveRequest(item)}><i className="fa-solid fa-check"></i></button>
                                    <button className='btn btn-outline-danger' onClick={() => doNotApproveRequest(item)}><i className="fa-solid fa-xmark"></i> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

