import Swal from 'sweetalert2';
import Modal from 'react-modal';
import {ButtonGreenSmall, ButtonWrapper, ButtonRed} from '../../../components/Empresa/Buttons';
import {useEffect, useState} from 'react';
import {Form, FloatingLabel} from 'react-bootstrap';
import { HttpEmpresaService } from '../../../services/HttpEmpresaService';
import InputGroup from 'react-bootstrap/InputGroup'; 

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

const ProductInfo = ({idProducto, nombreProducto, combo}) => {
    const [access, setAccess] = useState(false);
    const [existencias, setExistencias] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [productosCombo, setProductosCombo] = useState([]);

    const openForm = () => {
        setAccess(true);
    }

    const closeForm = () => {
        setAccess(false);
    }

    useEffect(() => {
        HttpEmpresaService.obtenerDirecciones(localStorage.getItem('correo'))
            .then((direcciones) => {
                let arreglo = [];
                for(let index=0; index<direcciones.length; index++){
                    const direccion = direcciones[index];
                    HttpEmpresaService.obtenerExistencias(direccion.idDireccion, idProducto )
                        .then((existencia) => {
                            let creado = existencia.length == 0 ? false : true;
                            arreglo.push({
                                direccion: direccion,
                                existencia: existencia,
                                existente: creado
                            })
                            if(index == (direcciones.length-1)){
                                setExistencias(arreglo);
                                setRefresh(false);
                            }
                        })
                }
            });
        
        if(combo){
            HttpEmpresaService.obtenerProductosCombo(idProducto)
                .then((productos) => {
                    if(productos.error == undefined){
                        setProductosCombo(productos.productos);
                    }
                });
        }

    
    }, [refresh, access]);

    const handleSubmit = (existencias, limitado, idDireccion, creado) => {
        HttpEmpresaService.insertExistencia(existencias, limitado, idProducto, idDireccion, creado)
            .then((result) => {
                if(result.error == undefined){
                    Swal.fire({
                        icon: 'success',
                        title: "Existencia actualizada exitosamente",
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: "No se pudo agregar la existencia",
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        setRefresh(true);
    }

    const printProductosCombo = productosCombo.map((item, index) => {
        return(
            <>
                <div className='form-modal-empresa item'>
                    <div    style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'left',
                        width: '100%',
                        height: '100%',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'left',
                        marginLeft: '10px',
                        marginTop: '10px',
                        marginBottom: '10px'
                    }}
                    >
                        {item.nombreProducto}
                        <img src={item.foto} alt="imagen" 
                        style={{
                            width:"150px", height:"150px", display:'block', margin:'auto',
                            border: '4px solid black', borderRadius: '4px'
                        }}/>
                    </div>
                </div>
            </>
        );
    });

    const printExistencias = existencias.map((item, index) => {
        let existencia = item.existencia;
        let direccion = item.direccion;
        let numExistencia = existencia.length > 0 ? item.existencia[0].existencias : 0;
        let limitado = existencia.length > 0 ? item.existencia[0].limitado : false;
        //console.log("Existencia: "+JSON.stringify(aux));
        const departamento = direccion.departamento;
        const municipio = direccion.municipio;
        return (
            <>
                {!combo && (
                    <Form className='form-modal-empresa' key={index} >
                        <div className='form-modal-empresa item'>
                            <h3 className='titulo-empresa-black'>Municipio: {municipio}, Departamento: {departamento}</h3>
                        </div>
                        <div className='form-modal-empresa item deploy'>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                            Existencias
                            </InputGroup.Text>
                            <Form.Control type="number" 
                            defaultValue={numExistencia}
                            onChange={(e) => e.target.value > 0 ? numExistencia = e.target.value : e.target.value = 0} 
                            required
                            />
                        </InputGroup>

                        <Form.Group style={{marginLeft:"100px"}} >
                            <Form.Label row="true" >
                                <Form.Check 
                                type="checkbox"
                                label="Productos Ilimitados"
                                defaultChecked={limitado}
                                onChange = {(e) => limitado = (e.target.checked)}
                                required
                                />
                            </Form.Label>
                        </Form.Group>
                        </div>
                        <div className='form-modal-empresa item'>
                            <ButtonGreenSmall
                                onClick={() => handleSubmit(numExistencia, limitado, direccion.idDireccion, item.existente)}
                                type="button"
                            >Enviar</ButtonGreenSmall>
                        </div>
                    </Form>
                )}
            </>
        );
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
                            onRequestClose={() => closeForm()}
                            style={customStyles}
                        >
                            <br/>
                            <h3>Informacion de {nombreProducto}</h3>
                            <div className='close'>
                                <ButtonRed
                                    onClick={() => closeForm()}
                                >
                                    Cerrar
                                </ButtonRed>
                            </div>
                            {printExistencias}
                            <br/><br/>       
                            {combo ? (
                                <>
                                    <h3>Productos del combo</h3>
                                    {printProductosCombo}
                                </>    
                            ): () => {}}                     
                            
                        </Modal>
                    </>
                )}
        </>
    );

}

export default ProductInfo;