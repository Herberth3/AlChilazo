import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import HttpClientService from '../../services/HttpClientService';

const ProductsEmpresa = ({empresa}) => {
    const [productos, setProductos] = useState([]);
    const [combos, setCombos] = useState([]);
    const [ofertas, setOfertas] = useState([]);
    const history = useHistory();

    const handleProduct = (id, esCombo) => {
        history.push(`/pedirProducto/${id}/${esCombo}`);
    }

    useEffect(() => {
        if(empresa != undefined && empresa != null){
            let httpClient = new HttpClientService()
            httpClient.post('getProductosEmpresa', {empresa: empresa})
                .then(responseProductos => {
                    httpClient.post('getCombosEmpresa', {empresa: empresa})
                        .then(responseCombos => {
                            const productos = responseProductos.productos;
                            const combos = responseCombos.combos;
                            const productosEmpresa = productos.concat(combos);
    
                            let products = [];
                            let combs = [];
                            let offs = [];
    
                            for(let index=0; index<productosEmpresa.length; index++){
                                let producto = productosEmpresa[index];
                                if(producto.oferta == true){
                                    offs.push(producto);
                                }
                                if(producto.combo == true){
                                    combs.push(producto);
                                }else{
                                    products.push(producto);
                                }   
                            }
    
                            setProductos(products);
                            setCombos(combs);
                            setOfertas(offs);
                        })
                })
                .catch(error => {
                    console.log(error);
                })
        }        
    }, [empresa]);


    return(
        <>
            <br/>
            <h2 style={{textAlign:'center'}}>PRODUCTOS</h2>
            <div className='triple-visualizer'>
                <div className='triple-visualizer container'>
                    <div className='text'>
                        <h2>OFERTAS</h2>
                        {ofertas.map((oferta, index) => {
                            return(
                                <>
                                    <div className='little-container blue' key={index}
                                        onClick={() => handleProduct(oferta.id, oferta.combo)}
                                    >
                                        <div className='image'>
                                            <img src={oferta.foto} alt="imagen" 
                                                style={{
                                                    width:"125px", height:"125px", display:'block', margin:'auto',
                                                    border: '1px solid white', borderRadius: '10px'
                                                }}/>
                                        </div>
                                        <div className='text'>
                                                <h3>{oferta.nombreProducto}</h3>
                                                <h4>Q{oferta.precio}</h4>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>

                </div>
                <div className='triple-visualizer container'>
                    <div className='text'>
                        <h2>COMBOS</h2>
                        {combos.map((combo, index) => {
                            return(
                                <>
                                    <div className='little-container yellow' key={index}
                                        onClick={() => handleProduct(combo.id, combo.combo)}
                                    >
                                        <div className='image'>
                                            <img src={combo.foto} alt="imagen" 
                                                style={{
                                                    width:"125px", height:"125px", display:'block', margin:'auto',
                                                    border: '1px solid white', borderRadius: '10px'
                                                }}/>
                                        </div>
                                        <div className='text'>
                                                <h3>{combo.nombreProducto}</h3>
                                                <h4>Q{combo.precio}</h4>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className='triple-visualizer container'>
                    <div className='text'>
                        <h2>PRODUCTOS</h2>
                        {productos.map((producto, index) => {
                            return(
                                <>
                                    <div className='little-container green' key={index}
                                        onClick={() => handleProduct(producto.id, producto.combo)}
                                    >
                                        <div className='image'>
                                            <img src={producto.foto} alt="imagen" 
                                                style={{
                                                    width:"125px", height:"125px", display:'block', margin:'auto',
                                                    border: '1px solid white', borderRadius: '10px'
                                                }}/>
                                        </div>
                                        <div className='text'>
                                                <h3>{producto.nombreProducto}</h3>
                                                <h4>Q{producto.precio}</h4>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )

}

export default ProductsEmpresa;