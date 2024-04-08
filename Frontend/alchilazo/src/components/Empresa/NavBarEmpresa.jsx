import '../../styles/LandingPage.css';
import '../../styles/flaticon.css';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HttpEmpresaService } from '../../services/HttpEmpresaService';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const NavBarEmpresa = () => {
    const [timer, setTimer] = useState(0);
    const history = useHistory();
    const handleExit = () => {
        localStorage.clear();
        history.push('/');
    }

    useEffect(() => {
        
    const token = localStorage.getItem('token');
    const rol = 'empresa';
    HttpEmpresaService.validateAuthentication(token, rol)
        .then((res) => {
            if(res){
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

    return(
        <>
            <header className="main">
                <div className="container">
                    <Link to="/" className='logoLandingPage' >
                        <span className="left"><img height={75} src={require('../../assets/images/AlChilazo.png')} alt="Logo" /></span>
                        <span className="suf">AlChilazo</span>
                    </Link>
                    <nav className="main">
                        <div>
                            <ul className="menu-primary">
                                <li>
                                    <Link to="/empresa/menu">Menu</Link>
                                </li>
                                <li>
                                    <Link to="/empresa/catalogo">Catalogo de Productos</Link>
                                </li>
                                <li>
                                    <Link to="/empresa/pedidos">Pedidos</Link>
                                </li>
                                <li>
                                    <Link to="/empresa/reportes">Reportes</Link>
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

export default NavBarEmpresa;