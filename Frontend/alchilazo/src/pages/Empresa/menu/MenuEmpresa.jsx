import { useEffect } from 'react';
import NavBarEmpresa from '../../../components/Empresa/NavBarEmpresa';

const MenuEmpresa = () => {

    useEffect  (() => {

    }, []);

    return (
        <>
            <NavBarEmpresa/>
            <div className="background-empresa-menu">
                <div className='small-cardEmpresa'>
                    <h1>Menu de {localStorage.getItem('nombre')}</h1>
                    <img
                        style={{
                            border: '3px solid grey',
                            width: '100%',
                        }}
                        alt="MenuEmpresa" 
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.xHWQu0kr0EGfsZB1d7M5MQHaC9%26pid%3DApi&f=1&ipt=a51d2cff59be8bddf1080704147327730b5eba65bf158d5b9697cd0a10d5899b&ipo=images"
                    />
                    <br/><br/><br/>
                </div>
            </div>
        </>
    );
}

export default MenuEmpresa;