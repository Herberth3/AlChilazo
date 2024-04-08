import { useEffect } from 'react';
import NavBarUser from '../../components/User/NavBarUser';
import HttpClientService from '../../services/HttpClientService';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import EmpresaCategory from '../../components/User/EmpresaCategory';
import { Link } from 'react-router-dom';


const NavegacionCategoria = () => {
    
    const [allCategorias, setAllCategorias] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const categoriesPerPage = 7; // Cantidad de categorias por página
    const totalPages = Math.ceil(categorias.length / categoriesPerPage); // Cálculo de la cantidad total de páginas
    const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual

    // Obtener los índices de inicio y fin para filtrar los categorias de la página actual
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    let currentCategorias = categorias.slice(startIndex, endIndex);


    const [selectedCategory, setSelectedCategory] = useState(   )

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };


    const search = (value) => {
        if(value == ''){
            setCategorias(allCategorias);
        }else{
            let filteredCategorys = [];
            for(let index=0; index<categorias.length; index++){
                if(categorias[index].categoria.toLowerCase().includes(value.toLowerCase())){
                    filteredCategorys.push(categorias[index]);
                }
            }
            setCategorias(filteredCategorys);
        }
        
    }

    useEffect  (() => {
        let httpclient = new HttpClientService();
        httpclient.get('getCategorias').then(response => {
            if(response){
                setCategorias(response.categorias);
                setAllCategorias(response.categorias);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    return (
        <>
            <NavBarUser/>
            <div className='background-usuario'>        
                <div className="content">
                    <div className='viewDouble'>
                        <div className='small-upper-cardEmpresa'>
                                <div style={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    backgroundColor: '#F2F2F2',
                                    color:'black',
                                    padding: '20px'
                                }}>
                                    <InputGroup > 
                                        <InputGroup.Text>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar..."
                                            onChange={(e) => search(e.target.value)}
                                            style={{
                                                width:'25%'
                                            }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '10px',
                                        }}>
                                            <button className='btn btn-outline-primary me-2' style={{width:'100px'}}  onClick={goToPreviousPage} disabled={currentPage === 1}>
                                            {'<'}
                                            </button>
                                            <span>{currentPage} de {totalPages} </span>
                                            <button style={{marginLeft:'5px', width:'100px'}}className='btn btn-outline-danger ' onClick={goToNextPage} disabled={currentPage === totalPages}>
                                            {'>'}
                                            </button>
                                        </div>
                                    </InputGroup>
                                    <div className='card bg-dark text-light p-2' style={{ cursor: "pointer" }} >
                                            <h5 className="card-title">
                                                <strong>
                                                    <Link className="nav-link" to='/menuUsuario'> MENU</Link>
                                                </strong>
                                            </h5>
                                    </div>
                                </div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: '10%' }}>Imagen</th>
                                            <th scope="col">Categoria</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{
                                        textAlign: 'center',
                                        verticalAlign: 'middle'
                                    }}>
                                        {currentCategorias.map((item, index) => (
                                            <tr key={item.idCategoria} onClick={() => setSelectedCategory(item.idCategoria)}>
                                                <td className="catalogoEmpresa par"><img src={item.foto} alt="imagen" 
                                                    style={{
                                                        width:"75px", height:"75px", display:'block', margin:'auto',
                                                        border: '1px solid white', borderRadius: '10px'
                                                    }}/>
                                                </td>
                                                <td className="catalogoEmpresa">{item.categoria}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                        </div>
                        
                        <div className='small-upper-cardEmpresa container'>
                            <EmpresaCategory
                                categoria={selectedCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavegacionCategoria;