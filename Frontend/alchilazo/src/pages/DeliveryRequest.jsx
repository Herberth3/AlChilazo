import React from 'react'
import Swal from 'sweetalert2';
import { NavbarAdmin } from '../components/Admin/NavbarAdmin';
import { useEffect, useState } from 'react';
import HttpClientService from '../services/HttpClientService';

export const DeliveryRequest = () => {

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
                setdeliveryRequest(res.drivers)
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
                httpClientService.post('admin/approveRequest', { id: item.idrepartidor, email: item.correo, estado: 1, approve: true }).then(res => {
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
                console.log('RESPUESTA', result.value);

                const httpClientService = new HttpClientService()
                httpClientService.post('admin/approveRequest', { id: item.idrepartidor, email: item.correo, estado: 0, approve: false, justification: result.value + "" }).then(res => {
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
            <div className='container mt-4'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombres</th>
                            <th scope="col">Apellidos</th>
                            <th scope="col">Email</th>
                            <th scope="col">Celular</th>
                            <th scope="col">NIT</th>
                            <th scope="col">Departamento</th>
                            <th scope="col">Municipio</th>
                            <th scope="col">Licencia</th>
                            <th scope="col">Transporte propio</th>
                            <th scope="col">CV</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryRequest.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.nombre}</td>
                                <td>{item.apellido}</td>
                                <td>{item.correo}</td>
                                <td>{item.celular}</td>
                                <td>{item.nit}</td>
                                <td>{item.departamento}</td>
                                <td>{item.municipio}</td>
                                <td>{item.tipo_licencia}</td>
                                <td>{item.transportePropio}</td>
                                <td><a href={item.cv ? item.cv : ''} target="_blank"><i className="fa-solid fa-file-pdf" style={{ 'cursor': 'pointer' }}></i></a></td>
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