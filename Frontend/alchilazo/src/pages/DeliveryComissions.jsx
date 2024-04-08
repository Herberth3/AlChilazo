import {useState, useEffect} from 'react';
import NavbarRepartidor from '../components/Delivery/NavbarRepartidor';
import HttpClientService from '../services/HttpClientService';

const DeliveryComissions = () => {
    const [comissions, setComissions] = useState([{}]);
    const comissionesPerPage = 3; // Cantidad de categorias por página
    const totalPages = Math.ceil(comissions.length / comissionesPerPage); // Cálculo de la cantidad total de páginas
    const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual

    // Obtener los índices de inicio y fin para filtrar los categorias de la página actual
    const startIndex = (currentPage - 1) * comissionesPerPage;
    const endIndex = startIndex + comissionesPerPage;
    let currentComissions = comissions.slice(startIndex, endIndex);

    useEffect(() => {
        let httpClient = new HttpClientService();
        httpClient.post('delivery/comissions', {correo: localStorage.getItem('correo')})
            .then(response => {
                setComissions(response.comissions);
            })
            .catch(error => console.log(error));
    }, []);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return(
        <>
            <NavbarRepartidor />
            <div className="centered-form">			
                <div className="modal-content container" 
                    style={{
                        height: '75vh',
                        overflowY: 'hidedn',
                    }}
                >
                    <h1 style={{color:'white', fontWeight: 'bolder'}}>COMISIONES</h1>
                    {currentComissions.map((comission, index) => {
                        return(
                            <>
                                <div className='visualizer container'>
                                    <h3 style={{color:'blue'}}>Orden #{comission.idcarrito}</h3>
                                    <div className='text'>                                                                                                                                                                
                                        <h3>Comision</h3>
                                        <h4>Q{comission.comision}</h4>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                    {comissions.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                        }}>
                            <button className='btn btn-outline-primary me-2' 
                            style={{width:'50px', backgroundColor:'white', color:'blue'}}                 
                            onClick={goToPreviousPage} disabled={currentPage === 1}>
                            {'<'}
                            </button>
                            <span>{currentPage} de {totalPages} </span>
                            <button style={{marginLeft:'5px', width:'50px', backgroundColor:'white', color:'red'}}
                            className='btn btn-outline-danger ' onClick={goToNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                            </button>
                        </div>      
                    ): (
                        <>
                            <h1 style={{color:'red', fontWeight: 'bolder'}}>SIN COMISIONES</h1>
                        </>
                    )}
                </div>
            </div>
        </>
    )

}


export default DeliveryComissions;