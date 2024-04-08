import { useState, useEffect } from 'react';
import NavBarEmpresa from '../../../components/Empresa/NavBarEmpresa';
import HttpClientService from '../../../services/HttpClientService';
import DetallesLista from './DetallesLista';
const ReportesEmpresa = () => {
    const [reporte, setReporte] = useState(0);
    const [print, setPrint] = useState(false);
    const [product, setProduct] = useState({});
    const [historial, setHistorial] = useState([]);
    useEffect(() => {
        if(reporte==1){
            //Productos mas vendidos
            const httpClient = new HttpClientService();
            httpClient.post('empresa/reportes/productosVendidos', {correo: localStorage.getItem('correo')})
                .then((response) => {
                    if(response){
                        if(response.data != undefined){
                            console.log(response.data);  
                            const product = response.data;
                            const type = response.tipo;
                            setProduct({
                                product,
                                type
                            });                          
                            setPrint(true);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);   
                })
        }else{
            //Historial Pedidos
            const httpClient = new HttpClientService();
            httpClient.post('empresa/reportes/historialPedidos', {correo: localStorage.getItem('correo')})
                .then(response => {
                    if(response){
                        if(response.data != undefined){
                            console.log(response.data);  
                            setHistorial(response.data);
                            setPrint(true);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [reporte])

    const handleTypeChange = (e) => {
        setReporte(e.target.value);
        setPrint(false);
    }

    return(
        <>
            <NavBarEmpresa />
            <div className='background-empresa-menu'>
                <div className='small-cardEmpresa'>
                    <h1 style={{textAlign:'center'}}>Reportes</h1>
                    <select  onChange={(e) => handleTypeChange(e)} className="form-select me-2 col" aria-label="Default select example">
                        <option value={0} >Seleccione un tipo de reporte</option>
                        <option value={1} >Productos mas vendidos</option>
                        <option value={2} >Historial Pedidos</option>
                    </select>

                </div>
                <div style={{marginTop:'-150px'}} className="cardEmpresa container">
                    {reporte == 1 && (
                        print && (
                            <>
                                <h1 style={{textAlign:'center', fontWeight:'bolder', color:'red'}}>Producto mas vendido</h1>
                                <h2 style={{textAlign:'center'}}>{product.product.nombre}</h2>
                                <h4 style={{textAlign:'center'}}>Cantidad vendida {product.product.total}</h4>
                                <img src={product.product.foto} alt="imagen" 
                                style={{
                                    width:"400px", height:"400px", display:'block', margin:'auto',
                                    border: '1px solid white', borderRadius: '10px'
                                }}/>
                            </>
                        )
                    )}
                    {reporte == 2 && (
                        <>
                            <table className="table table-hover">
                                <thead style={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle'
                                }}>
                                    <tr>
                                        <th scope="col" style={{ width: '10%' }}>Orden</th>
                                        <th scope="col">Articulos Solicitados</th>
                                        <th scope="col">Precio Total</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Ver Detalles</th>
                                    </tr>

                                </thead>
                                <tbody style={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle'
                                }}>
                                    {historial.map((item, index) => {
                                        const lista = item.lista;
                                        const productos = item.productos;
                                        const combos = item.combos;
                                        let cantidad = 0;
                                        productos.map((item, index) => {
                                            cantidad += item.cantidad;
                                        })
                                        combos.map((item, index) => {
                                            cantidad += item.cantidad;
                                        })
                                        return(
                                            <>
                                                <tr key={index}>
                                                    <td>{lista.idListaPedidos}</td>
                                                    <td>{cantidad}</td>
                                                    <td>Q{lista.precio}</td>
                                                    <td>{lista.fecha}</td>
                                                    <td>
                                                        <DetallesLista 
                                                            lista={lista}
                                                            productos={productos}
                                                            combos={combos}
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ReportesEmpresa;