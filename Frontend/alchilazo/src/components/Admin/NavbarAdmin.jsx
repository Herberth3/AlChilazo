import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HttpEmpresaService } from '../../services/HttpEmpresaService';
export const NavbarAdmin = () => {
    const history = useHistory();
    const [timer, setTimer] = useState(0);
    const handleLogout = () => {
        localStorage.clear();
        history.push("/");
    };

    useEffect(() => {
        
        const token = localStorage.getItem('token');
        const rol = 'admin';
        HttpEmpresaService.validateAuthentication(token, rol)
            .then((res) => {
                if(res != undefined && res != null){
                    if(!res.access){
                        history.push('/');
                    }
                }else{
                    history.push('/');
                }
            })
            
            const id = setInterval(() => {
                setTimer((prev) => prev + 1)
              }, 60000)
            return () => {
                clearInterval(id)
            }
        }, [timer])

    return (
        <>
            <div className='bg-dark py-2'>
                <nav className="container navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/"><img style={{ width: '25px' }} src="https://res.cloudinary.com/alex4191/image/upload/v1685731006/Alchilazo/ALCHILAZO_bpuyvh.png" className='me-3' />AlChilazo</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to='/admin/delivery-drivers'> Repartidores</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/companies'> Empresas</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/users'> Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/admin/reports'> Reportes</Link>
                            </li>
                        </ul>
                                
                        <form className="form-inline my-2 my-lg-0" onSubmit={handleLogout}>
                            <button className="btn btn-outline-danger my-2 my-sm-0" type="submit"><i className="fa-solid fa-right-from-bracket me-1"></i> Salir</button>
                        </form>
                    </div>
                </nav>
            </div>
        </>
    )
}
