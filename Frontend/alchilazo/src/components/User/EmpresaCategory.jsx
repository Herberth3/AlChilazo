import { useEffect, useState } from "react";
import HttpClientService from "../../services/HttpClientService";
import ProductsEmpresa from "./ProductsEmpresa";
import '../../styles/Empresa.css'

const EmpresaCategory = ({categoria}) => {
    const [mode, setMode] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const empresasPerPage = 6; // Cantidad de categorias por página
    const totalPages = (Math.ceil(empresas.length / empresasPerPage));
    const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual

    // Obtener los índices de inicio y fin para filtrar los categorias de la página actual
    const startIndex = (currentPage - 1) * empresasPerPage;
    const endIndex = startIndex + empresasPerPage;
    let currentEmpresas = empresas.slice(startIndex, endIndex);


    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };


    const chargeProducts = (idEmpresa) => {
        setSelectedEmpresa(idEmpresa);
        setMode(true);
    }

    
    
    useEffect  (() => {
        setMode(false);
        setSelectedEmpresa(null);
        if(categoria){
            let httpclient = new HttpClientService();
            httpclient.post('empresaCategory', {categoria:categoria, correo: localStorage.getItem('correo')}).then(response => {
                if(response){
                    if(response.data != undefined){
                        setEmpresas(response.data);
                        setCurrentPage(1);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                setEmpresas([]);
            })        
        }              
    }, [categoria]);

    return(
        <>
            {mode ? (
                <ProductsEmpresa 
                    empresa={selectedEmpresa}
                />
            ): (
                <>
                    <br/>
                    <h1 style={{textAlign:'center'}}>Empresas</h1>
                    <div className="visualizer">
                        {currentEmpresas.map((empresa, index) => {
                            try{
                                const jsonData = JSON.parse(empresa.url);
                                return(
                                    <>
                                        <div className="visualizer container" key={index}
                                            onClick={() => chargeProducts(empresa.idEmpresa)}
                                        >
                                            <div className="image">
                                                <img src={jsonData.logo} alt="imagen" 
                                                style={{
                                                    width:"75px", height:"75px", display:'block', margin:'auto',
                                                    border: '1px solid white', borderRadius: '10px'
                                                }}/>
                                            </div>
                                            <div className="text">
                                                <h3>{empresa.nombre}</h3>
                                                <h4>{empresa.municipio}</h4>
                                            </div>
                                        </div>                                    
                                    </>                            
                                )
                            }catch(error){
                                console.log(error);
                            }
                        })}                
                    </div>  
                    {empresas.length > 0 && (
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
                    )}
                </>
            )}
        </>
    )



};


export default EmpresaCategory;