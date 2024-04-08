import React from 'react'
import { NavbarAdmin } from '../../components/Admin/NavbarAdmin'
import { useEffect, useState } from 'react';
import HttpClientService from '../../services/HttpClientService';
import Swal from 'sweetalert2';

export const DisableUsers = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        getUsers()

        return () => {
        }

    }, [])


    const getUsers = () => {
        const httpClientService = new HttpClientService()
        httpClientService.get('admin/users').then(res => {
            if (!res.error) {
                console.log('USUARIOS:', res);
                setUsers(res)
            } else { console.log('ERROR: ', res.error) }
        })
    }

    const disableUsers = (user) => {
        const httpClientService = new HttpClientService()
        httpClientService.post('admin/users', { idUser: user.idUsuario, estado:2 }).then(res => {
            if (!res.error) {
                Swal.fire({ title: res.message, icon: 'success' })
                getUsers()
            } else { console.log('ERROR: ', res.error) }
        });
    }

    const ableUsers = (user) => {
        const httpClientService = new HttpClientService()
        httpClientService.post('admin/users', { idUser: user.idUsuario, estado:1 }).then(res => {
            if (!res.error) {
                Swal.fire({ title: res.message, icon: 'success' })
                getUsers()
            } else { console.log('ERROR: ', res.error) }
        });
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
                            <th scope="col">Departamento</th>
                            <th scope="col">Municipio</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Deshabilitar</th>
                            <th scope="col">Habilitar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.nombre}</td>
                                <td>{item.apellido}</td>
                                <td>{item.correo}</td>
                                <td>{item.celular}</td>
                                <td>{item.departamento}</td>
                                <td>{item.municipio}</td>
                                <td>{item.estado == 1 ? 'ACTIVO' : 'DESACTIVADO'}</td>
                                <td>
                                    {item.estado == 1 && <button className='btn btn-outline-primary me-2' onClick={() => disableUsers(item)}><i className="fa-solid fa-check"></i></button>}
                                </td>
                                <td>
                                    {item.estado == 2 && <button className='btn btn-outline-primary me-2' onClick={() => ableUsers(item)}><i className="fa-solid fa-check"></i></button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
