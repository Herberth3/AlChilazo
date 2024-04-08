import Modal from 'react-modal';
import {useEffect, useState} from 'react';
import {ButtonGreenSmall, ButtonWrapper, ButtonRed} from '../../../components/Empresa/Buttons';

Modal.setAppElement('#root');

const customStyles = {
    content: {
        width: '40%',
        height: '50%',
        margin: 'auto',
        background: 'white',
        border: '5px solid #b3b3b3',
        align: 'center'
    },
};

const DetallesLista = ({lista, productos, combos}) => {
    const [access, setAccess] = useState(false);

    useEffect(() => {

    }, [access])


    const openForm = () => {
        setAccess(true);
    };

    const printProductos = productos.map((producto, index) => {
        return(
            <>
                <div className='item' key={index}
                    style = {{background:'whitesmoke'}}
                >
                    <h3 style={{background:'grey', color:'white', fontWeight:'bolder'}}>{producto.nombreProducto}</h3>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Cantidad</h4>
                        <h5>{producto.cantidad}</h5>
                        <h4>Precio</h4>
                        <h5>Q{producto.precio}</h5>
                    </div>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Descripcion</h4>
                        <h5>{producto.descripcion}</h5>
                    </div>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Foto</h4>
                        <img src={producto.foto} alt="Foto" width="200" height="200"/>
                    </div>
                </div>
                <br/>
            </>
        )
    });

    const printCombos = combos.map((producto, index) => {
        return(
            <>
                <div className='item' key={index}
                    style = {{background:'whitesmoke'}}
                >
                    <h3 style={{background:'grey', color:'white', fontWeight:'bolder'}}>{producto.nombreCombo}</h3>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Cantidad</h4>
                        <h5>{producto.cantidad}</h5>
                        <h4>Precio</h4>
                        <h5>Q{producto.precio}</h5>
                    </div>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Descripcion</h4>
                        <h5>{producto.descripcion}</h5>
                    </div>
                    <div style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <h4>Foto</h4>
                        <img src={producto.foto} alt="Foto" width="200" height="200"/>
                    </div>
                </div>
                <br/>
            </>
        )
    });

    return(
        <>
                <button className='btn btn-outline-primary me-2'
                onClick={() => openForm()}
                ><i className="fa-solid fa-check"></i></button>
                {access && (
                    <>
                        <Modal
                            isOpen={access}
                            onRequestClose={() => setAccess(true)}
                            style={customStyles}
                        >
                            <br/>
                            <h3>Detalles del Pedido</h3>
                            <div className='close'>
                                <ButtonRed
                                    onClick={() => setAccess(false)}
                                >
                                    X
                                </ButtonRed>
                            </div>
                            <div className='form-modal-empresa'>
                                <div className='item' style={{background:'gray', color:'white'}}>
                                    <h3 style={{textAlign:'center', fontWeight:'bolder'}}>Descripcion del Pedido</h3>
                                    <h5 style={{textAlign:'center'}}>{lista.descripcion}</h5>
                                </div>
                                <br/>
                                <div className='item'>
                                    <h3 style={{textAlign:'center', fontWeight:'bolder'}}>Productos</h3>
                                    {printProductos}
                                    {printCombos}
                                </div>
                            </div>
                            
                        </Modal>
                    </>
                )}
        </>
    );
}

export default DetallesLista;