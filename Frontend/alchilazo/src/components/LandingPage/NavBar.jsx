import '../../styles/LandingPage.css';
import '../../styles/flaticon.css';

const NavBar = () => {
    return(
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
                                    <a href="/loginAdmin">ADMINS</a>	
                                </li>
                                <li>
                                    <a href="/delivery/login">Repartidores</a>	
                                </li>
                                <li>
                                    <a href="/empresa/login">Empresas</a>	
                                </li>
                                <li>
                                    <a href="/loginUsuario">Usuarios</a>	
                                </li>
                            </ul>
                        </div>
                    </nav>
                    
                </div>
            </header>
        </>
        
    );
}

export default NavBar;