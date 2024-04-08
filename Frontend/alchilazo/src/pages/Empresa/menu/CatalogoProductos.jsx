import NavBarEmpresa from "../../../components/Empresa/NavBarEmpresa";
import { ButtonWrapper, ButtonGreen, ButtonYellow } from "../../../components/Empresa/Buttons";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { HttpEmpresaService } from "../../../services/HttpEmpresaService";
import ProductInfo from "./ProductInfo";
import Swal from "sweetalert2";

const CatalogoProductos = () => {
    const history = useHistory();
    const [productos, setProductos] = useState([]);
    const productsPerPage = 2; // Cantidad de productos por página
    const totalPages = Math.ceil(productos.length / productsPerPage); // Cálculo de la cantidad total de páginas
    const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual

    // Obtener los índices de inicio y fin para filtrar los productos de la página actual
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = productos.slice(startIndex, endIndex);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };
    useEffect(() => {
        HttpEmpresaService.getEmpresa(localStorage.getItem('correo'))
            .then((res) => {
                HttpEmpresaService.getProductos(res.idEmpresa)
                .then((resultProductos) => {
                    if(resultProductos.error == undefined){
                        HttpEmpresaService.getCombos(res.idEmpresa)
                            .then((resultCombos) => {
                                if(resultCombos.error == undefined){
                                    setProductos(resultProductos.concat(resultCombos));
                                }
                            });
                    }
                })
            })
            .catch((err) => {
                console.log(err)   
            });
    }, []);

    const deleteProducto = (idProducto, combo) => {
        Swal.fire({
            icon: 'info',
            title: 'Eliminar Producto',
            text: '¿Estas seguro de eliminar el producto?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                HttpEmpresaService.deleteProduct(idProducto, combo)
                .then((res) => {
                    if(!res.deleted){
                        Swal.fire({
                            icon: 'error',
                            title: "No se pudo eliminar el producto",
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: res.message,
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.href = "/empresa/catalogo";
                        });
                    }
                });
            }
        })
    }
    
    const modificarProducto = (idProducto, combo) => {
        history.push(`/empresa/panelModify/${idProducto}/${combo}`);
    }

    const printProductos = () => {
        return (
            <div className='container mt-4'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Descripcion</th>
                            <th scope="col">Es oferta</th>
                            <th scope="col">Es combo</th>
                            <th scope="col">Existencias</th>
                            <th scope="col">Modificar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}>
                        {currentProducts.map((item, index) => (
                            <tr key={index*currentPage}>
                                <th scope="row">{(index*currentPage) + 1}</th>
                                <td className="catalogoEmpresa par"><img src={item.foto} alt="imagen" 
                                    style={{
                                        width:"150px", height:"150px", display:'block', margin:'auto',
                                        border: '4px solid black', borderRadius: '4px'
                                    }}/>
                                </td>
                                <td className="catalogoEmpresa">{item.nombreProducto}</td>
                                <td className="catalogoEmpresa par">{item.categoria}</td>
                                <td className="catalogoEmpresa">Q{item.precio}</td>
                                <td className="catalogoEmpresa par">{item.descripcion}</td>
                                <td className="catalogoEmpresa">{item.oferta ? "SI" : "NO"}</td>
                                <td className="catalogoEmpresa par">{item.combo ? "SI" : "NO"}</td>
                                <td>
                                    <ProductInfo 
                                        idProducto={item.id}
                                        combo={item.combo}
                                        nombreProducto={item.nombreProducto}
                                    />
                                </td>
                                <td >
                                    <button className='btn btn-outline-warning me-2' 
                                        onClick={() => modificarProducto(item.id, item.combo)}
                                    ><i className="fa-solid fa-check"></i></button>
                                </td>
                                <td>
                                    <button className='btn btn-outline-danger' 
                                        onClick={() => deleteProducto(item.id, item.combo)}
                                    ><i className="fa-solid fa-xmark"></i> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                }}>
                    <button className='btn btn-outline-primary me-2'  onClick={goToPreviousPage} disabled={currentPage === 1}>
                     {'<'}
                    </button>
                    <span>{currentPage} de {totalPages} </span>
                    <button style={{marginLeft:'5px'}}className='btn btn-outline-danger '  onClick={goToNextPage} disabled={currentPage === totalPages}>
                    {'>'}
                    </button>
                </div>
            </div>
        );
    }

    const handleInsert = () => {
        history.push('/empresa/panelAdd');
    }

    return(
        <>
            <NavBarEmpresa/>
            <div className="background-empresa-menu">
                <div className="cardEmpresa container">
                    <h1 className="titulo-empresa-black">Catalogo de Productos</h1>
                    {printProductos()}
                    <div className='form-modal-empresa item'>
                        <ButtonWrapper>
                            <ButtonGreen type='button'
                            onClick={handleInsert}>Ingresar Producto</ButtonGreen>
                        </ButtonWrapper>
                    </div>
                </div>
            </div>
        </>
    );

}


export default CatalogoProductos;