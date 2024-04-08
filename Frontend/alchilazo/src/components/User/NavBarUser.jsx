import '../../styles/LandingPage.css';
import '../../styles/flaticon.css';
import '../../styles/Empresa.css';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { HttpEmpresaService } from '../../services/HttpEmpresaService';
const NavBarUser = () => {
    const history = useHistory();
    const [timer, setTimer] = useState(0);
    const handleExit = () => {
        localStorage.clear();
        history.push('/');
    }

    useEffect(() => {        
        const token = localStorage.getItem('token');
        const rol = 'usuario';
        HttpEmpresaService.validateAuthentication(token, rol)
            .then((res) => {
                if(res != undefined){
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
            <header className="main">
                <div className="container">
                    <a href="/" className='logoLandingPage' >
                        <span className="left"><img height={75} src={require('../../assets/images/AlChilazo.png')} alt="Logo" /></span>
                        <span className="suf">AlChilazo</span>
                    </a>
                    <nav className="main">
                        <div>
                            <ul className="menu-primary">
                                <li>
                                    <Link className="nav-link" to='/menuUsuario'> Menu</Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to='/navegacionCategoria'> Categoria</Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to='/carrito'> Carrito</Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to='/estadoPedidos'> Estado Pedidos</Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to='/historialPedidos'> Historial</Link>
                                </li>
                            </ul>
                            <a className='exit' onClick={handleExit}>CERRAR SESION</a>
                        </div>
                    </nav>

                </div>
            </header>
        </>
    );
}

export default NavBarUser;