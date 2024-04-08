import NavBarEmpresa from "../../../components/Empresa/NavBarEmpresa";
import { ButtonWrapper, ButtonGreen, ButtonYellow, ButtonGreenSmall} from "../../../components/Empresa/Buttons";
import {Form, FloatingLabel} from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'; 
import UploadFile from "../../../components/Empresa/UploadFile";
import { Categoria } from "../../../components/Empresa/Categoria";
import { useState, useEffect } from "react";
import { HttpEmpresaService } from "../../../services/HttpEmpresaService";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const ProductModify = () => {
    //form
    const {idProducto, esCombo} = useParams();
    const [categoria, setCategoria] = useState("");
    const [idCategoria, setIdCategoria] = useState(0);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState(0);
    const [oferta, setOferta] = useState(false);
    const [combo, setCombo] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [renderImagen, setRenderImagen] = useState(null);
    //endform
    
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(0);

    const [labelNombreProducto, setNombreProducto] = useState("Nombre Producto");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        
        const id = setInterval(() => {
            setTimer((prev) => prev + 1)
          }, 500)
        return () => {
            clearInterval(id)
        }
              
    }, [timer])

    useEffect(() => {
        HttpEmpresaService.getProduct(idProducto, esCombo)
            .then((result) => {
                let product = result.producto;
                setNombre(product.nombreProducto);
                setPrecio(product.precio);
                let esOferta = product.oferta == 1 ? true : false;
                setOferta(esOferta);
                let combo = esCombo == 1 ? true : false;
                setCombo(combo);
                setDescripcion(product.descripcion);
                setRenderImagen(product.foto);
                setIdCategoria(product.idCategoria);
                setCategoria(product.categoria);                    

                if(combo){
                    HttpEmpresaService.getEmpresa(localStorage.getItem('correo'))
                    .then((res) => {
                        if(res.error == undefined){
                            HttpEmpresaService.getProductos(res.idEmpresa)
                                .then((resultProductos) => {
                                    setProductos(resultProductos);
                                    HttpEmpresaService.obtenerProductosCombo(idProducto)
                                        .then((result) => {
                                            let productosCombo = result.productos;
                                            let newArray = [];
                                            for(let index=0; index<productosCombo.length; index++){
                                                /*newArray.push({
                                                    idProducto: productosCombo[index].idProducto,
                                                    nombreProducto: productosCombo[index].nombreProducto,
                                                });*/
                                                newArray.push(productosCombo[index].idProducto);
                                            }
                                            setSelectedProducts(newArray);
                                        });  
                                })
                        }
                    });                                       
                }
            })
        
    }, [])

    useEffect(() => {
        HttpEmpresaService.getEmpresa(localStorage.getItem('correo'))
            .then((res) => {
                if(res.error == undefined){
                    HttpEmpresaService.getProductos(res.idEmpresa)
                        .then((result) => {
                            setProductos(result);
                        })
                }
            });
    }, [combo]);

    
    const handleImagen = (file) => {
        setImagen(file);
        if (file) {
            const reader = new FileReader();
        
            reader.onloadend = () => {
                setRenderImagen(reader.result);
            };      
            reader.readAsDataURL(file);
        } else {
        setRenderImagen(null);
        }
    };

    const encontrarProductoPorId = (idProducto) => {
        let findProduct = productos.find(producto => producto.id == idProducto);
        if(findProduct != undefined){
            return findProduct.nombreProducto;
        }
        return "";
      };

    const pushProduct = () => {
        if(selectedProduct!=0){
            const isSelected = selectedProducts.includes(selectedProduct);
            if(!isSelected){
                setSelectedProducts([...selectedProducts, selectedProduct]);
            }
        }
    }

    const popProduct = () => {
        console.log("SelectedProducts: "+selectedProducts)
        console.log("SelectedProduct: "+selectedProduct)
        if(selectedProduct!=0){
            let isSelected = false;
            for(let index=0; index<selectedProducts.length; index++){
                if(selectedProducts[index]==selectedProduct){
                    isSelected=true;
                    break;
                }
            }
            console.log("IsSelected: "+isSelected)
            if(isSelected){
                let newArray = selectedProducts;
                for(let index=0; index<selectedProducts.length; index++){
                    if(selectedProducts[index]==selectedProduct){
                        newArray.splice(index, 1);
                    }
                }
                setSelectedProducts(newArray);
            }
        }
    }

    const modifyProduct = (url) => {
        if(combo){
            if(selectedProducts.length>=2){
                HttpEmpresaService.modifyProduct(idProducto, nombre, idCategoria, precio, descripcion, url, oferta, selectedProducts, combo)
                    .then((response) => {
                        if(!response.modify){
                            Swal.fire({
                                icon: 'error',
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            Swal.fire({
                                icon: 'success',
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                window.location.href = "/empresa/catalogo";
                            });
                        }
                    });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: "La cantidad de productos del combo debe ser 2 o mayor",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }else{
            HttpEmpresaService.modifyProduct(idProducto, nombre, idCategoria, precio, descripcion, url, oferta, selectedProducts, combo)
                    .then((response) => {
                        if(!response.modify){
                            Swal.fire({
                                icon: 'error',
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            Swal.fire({
                                icon: 'success',
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                window.location.href = "/empresa/catalogo";
                            });
                        }
                    });
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(nombre!="" && precio>=0 && descripcion!="" ){
            const nameFoto = "producto-"+nombre;
            if(imagen!=null && imagen!=undefined){
                HttpEmpresaService.uploadFile(imagen, nameFoto)
                    .then((result) => {
                        modifyProduct(result);
                    })
            }else{
                modifyProduct(renderImagen);
            }
            
        }else{
            if(precio <= 0){
                Swal.fire({
                    icon: 'warning',
                    title: "El precio no puede ser 0 o menor a 0",
                    showConfirmButton: false,
                    timer: 1500
                })                
            }if(descripcion==""){
                Swal.fire({
                    icon: 'warning',
                    title: "La descripcion no puede estar vacia",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }


    const showInfo = () => {
        console.log("Nombre: "+nombre);
        console.log("Precio: "+precio);
        console.log("Descripcion: "+descripcion);
        console.log("Imagen: "+imagen);
        console.log("RenderImagen: "+renderImagen);
        console.log("Categoria: "+idCategoria);
        console.log("Oferta: "+oferta);
        console.log("Combo: "+combo);
        console.log("esCombo: "+esCombo);
        console.log("SelectedProducts: "+selectedProducts);
        console.log("SelectedProduct: "+selectedProduct);
    }

    return (
        <>
            <NavBarEmpresa/>
            <div className="background-registro">
                <div className="small-cardEmpresa">
                <h1 className='titulo-empresa-black'>Modificar Producto</h1>
                <button onClick={showInfo}
                    hidden={true}
                >Check me</button>
                <Form className='form-modal-empresa' onSubmit={handleSubmit}>
                        <div className='form-modal-empresa item'>
                            <Form.Group className="mb-3" controlId="entidad">
                                <FloatingLabel  label={labelNombreProducto}>
                                    <Form.Control type="text" placeholder="Nombre Producto"
                                    onChange={(e) => setNombre(e.target.value)}
                                    defaultValue={nombre}
                                    required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item deploy'>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                Precio
                                </InputGroup.Text>
                                <InputGroup.Text>
                                Q
                                </InputGroup.Text>
                                <Form.Control 
                                    type="number" 
                                    step="0.01"
                                    value={precio}
                                    onChange={(e) => {e.target.value>0 ? setPrecio(e.target.value) : e.target.value=0}}
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                Categoria: 
                                </InputGroup.Text>
                                <InputGroup.Text>
                                    {categoria}
                                </InputGroup.Text>
                                <InputGroup.Text>
                                    <Categoria
                                        setCategoria = {setCategoria}
                                        setIdCategoria = {setIdCategoria}
                                        setNombreProducto = {setNombreProducto}
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className="form-modal-empresa item">
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="nameEncuesta">Descripcion del producto</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows = {4}
                                        defaultValue={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        required
                                    />  
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item deploy border'>
                            <UploadFile                                 
                                label="Imagen Producto"
                                setSelectedFile={handleImagen}
                                simpleLabel = {"imagen"}
                                type = {".png,.jpg,.jpeg"}
                                required = {false}
                            />
                            <img src={renderImagen} alt="imagen" 
                                style={{
                                    width:"200px", height:"200px", display:'block', margin:'auto',
                                    border: '4px solid black', borderRadius: '4px'
                                }}/>
                        </div>
                        <div className='form-modal-empresa item deploy'>    
                            
                            <Form.Group style={{marginLeft:"100px"}} >
                                <Form.Label row="true" >
                                    <Form.Check 
                                    type="checkbox"
                                    label="¿Es oferta?"
                                    checked={oferta}
                                    onChange = {(e) => setOferta(e.target.checked)}
                                    />
                                </Form.Label>
                            </Form.Group>
                            {combo && (
                                <Form.Group style={{marginLeft:"100px"}} >
                                <Form.Label row="true" >
                                    <Form.Check 
                                    type="checkbox"
                                    label="¿Es combo?"
                                    checked={combo}
                                    onChange = {(e) => setCombo(e.target.checked)}
                                    />
                                </Form.Label>
                            </Form.Group>  
                            )}
                            
                        </div>
                        {combo && (
                            <>                                
                            <div className='form-modal-empresa item deploy border'>
                                <Form.Group className="mb-3">
                                    <Form.Group className="mt-15">
                                        <Form.Label>Seleccionar Productos</Form.Label>
                                    </Form.Group>
                                    <Form.Select 
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {productos.map((producto, index) => (
                                            <option key={index} value={producto.id}>{producto.nombreProducto}</option>
                                        ))}
                                    </Form.Select>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '10px',
                                        marginTop: '15%'
                                    }}>
                                        <button type="button" className='btn btn-outline-primary me-2' onClick={() => pushProduct()}><i className="fa-solid fa-check">Agregar</i></button>
                                        <button type="button"  className='btn btn-outline-danger' onClick={() => popProduct()}><i className="fa-solid fa-xmark">Retirar</i> </button>
                                    </div>
                                </Form.Group>


                                <Form.Group style={{marginLeft:'50px'}}>
                                    <Form.Group className="mt-15">
                                        <Form.Label>Productos Seleccionados</Form.Label>
                                    </Form.Group>
                                    <Form.Group style={{
                                        backgroundColor:'white',
                                        border:'1px solid black',
                                        fontSize:'15px',
                                        height:'250px',
                                    }} >
                                        <ul>
                                            {selectedProducts.map((producto, index) => (
                                                <li key={index}>{encontrarProductoPorId(producto)}</li>
                                            ))}
                                        </ul>
                                    </Form.Group>
                                </Form.Group>
                                
                            </div>
                            </>
                        )}
                        
                        <div className='form-modal-empresa item'>
                            <ButtonWrapper>
                                <ButtonYellow type='submit'>Modificar</ButtonYellow>
                            </ButtonWrapper>
                        </div>    
                    </Form>
                </div>
            </div>
        </>
    );

}

export default ProductModify;