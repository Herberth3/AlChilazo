import Swal from 'sweetalert2';
import Modal from 'react-modal';
import {ButtonGreenSmall, ButtonWrapper, ButtonRed} from './Buttons';
import {useEffect, useState} from 'react';
import {HttpEmpresaService} from '../../services/HttpEmpresaService';
import {Form, FloatingLabel} from 'react-bootstrap';
import UploadFile from './UploadFile';
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
export const Categoria = ({setCategoria, setIdCategoria, setNombreProducto}) => {
    const [access, setAccess] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [timer, setTimer] = useState(0);
    const [categoriaImage, setCategoriaImage] = useState(null);
    const[categoria, setSelectedCategoria] = useState("");
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        HttpEmpresaService.getCategorias()
            .then(response => {
                setCategorias(response);
            })

        
        setRefresh(false);
    }, [access, refresh])

    const printCategorias = categorias.map((categoria) => {
        return(
            <>
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.categoria}
                </option>
            </>  
        );
    });

    const addCategoria = (event) => {
        event.preventDefault();
        if(newCategory != undefined || newCategory != null){
            if(newCategory != ""){
                const name = newCategory + "-categoria-"+categorias.length;
                HttpEmpresaService.addCategoria(newCategory, categoriaImage, name)
                    .then((response) => {
                        if(response.access != undefined){
                            Swal.fire({
                                icon: 'success',
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setNewCategory("");
                            setRefresh(!refresh);
                        }
                    })
            }else{
                alert("Ingrese un nombre de categoria")
            }
        }
    }

    const handleCategorias = (event) => {
        const option = event.target.value;
        if(option != null && option != ""){
            let id = categorias.find((categoria) => categoria.idCategoria == option);            
            setIdCategoria(event.target.value);
            setCategoria(id.categoria);
            setSelectedCategoria(id.categoria);
        }
        
    }

    const openForm = () => {
        setNombreProducto("")
        setAccess(true);
    }

    const closeForm = () => {
        setNombreProducto("Nombre Producto")
        setAccess(false);
    }

    return(
        <>
                <ButtonGreenSmall 
                onClick={() => openForm()}
                type='button'>Seleccionar</ButtonGreenSmall>
                {access && (
                    <>
                        <Modal
                            isOpen={access}
                            onRequestClose={() => closeForm()}
                            style={customStyles}
                        >
                            <br/>
                            <h3>Categorias</h3>
                            <div className='close'>
                                <ButtonRed
                                    onClick={() => closeForm()}
                                >
                                    Cerrar
                                </ButtonRed>
                            </div>
                            <br/><br/>
                            <Form className='form-modal-empresa'>
                                <div className="form-modal-empresa item">
                                    <Form.Group className="mb-3">
                                        <Form.Group className="mt-15">
                                            <Form.Label><h6>Categoria Seleccionada: {categoria}</h6> </Form.Label>
                                        </Form.Group>
                                        <Form.Select 
                                            onChange={(event) => handleCategorias(event)}
                                            required
                                        >
                                            <option value="">Seleccionar</option>
                                            {printCategorias}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="form-modal-empresa item">
                                    <ButtonWrapper>
                                        <ButtonGreenSmall
                                        onClick={() => closeForm()}
                                        type='button'>OK</ButtonGreenSmall>
                                    </ButtonWrapper>
                                </div>
                            </Form>

                            <Form className='form-modal-empresa' >
                                <div className="form-modal-empresa item deploy">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Agregar Categoria</Form.Label>
                                        <Form.Control type="text" placeholder="Nombre Categoria"
                                            value = {newCategory}
                                            onChange={(event) => setNewCategory(event.target.value)}
                                        required
                                        />
                                    </Form.Group>
                                    <UploadFile 
                                        label="Imagen Categoria"
                                        setSelectedFile={setCategoriaImage}
                                        simpleLabel = {"categoria"}
                                        type = {".png,.jpg,.jpeg"}
                                        required = {true}
                                        />
                                </div>
                                <div className="form-modal-empresa item">
                                    <ButtonWrapper>
                                        <ButtonGreenSmall
                                        onClick={addCategoria}
                                        type='button'>Registrar Categoria</ButtonGreenSmall>
                                    </ButtonWrapper>
                                </div>
                            </Form>

                        </Modal>
                    </>
                )}
        </>
    );
}