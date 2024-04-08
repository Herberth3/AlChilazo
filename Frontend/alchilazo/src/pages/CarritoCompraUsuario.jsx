import NavBarUser from '../components/User/NavBarUser';
import '../styles/RealizarPedidosUsuario.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ModalListaPedidos from '../components/Pedido/ModalListaPedidos';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
const CarritoCompraUsuario = () => {
    // Cargamos el carrito --> carritoActual
    // Cargamos Lista_Pedidos de CarritoActual --> Array de Lista_Pedidos
    // Cargamos Pedido de cada Lista_Pedidos   ---> Array de Pedido
        // -> Si es un producto cargamos su info  --> Producto
        // -> si es combo cargamos su info        --> Combo
            // --> Cargamos todos los Productos   --> Array de Producto
 
	const history = useHistory();	
    const correo = localStorage.getItem('correo'); //usamos el correo para enviarlo a recuperar el carrito, de esta forma haremos relaciones en las tablas usuario y carrito
    const [listaPedidosCarrito, setListaPedidosCarrito] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio 
    const [precioCarrito, setPrecioCarrito] = useState(0);
    const [direccion, setDireccion] = useState("");
    //Use effect para cargar datos del carrito
	useEffect(() => {
        const api = "carrito/listadoProductosUsuario";
		const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correo })//enviamos correo para buscar el carrito activo del usuario
        };
		fetch("http://137.184.41.188:4000/api/" + api, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if(result.statusCode === 200){//hay datos
                    setListaPedidosCarrito(result.data);
                }
			})
		.catch((error) => console.error(error));
	}, []);

    useEffect(() => {
        setShowInputs(Array(listaPedidosCarrito.length).fill(false));
        const precioAcumulado = listaPedidosCarrito.reduce((acumulado, item) => acumulado + item.precio, 0);
        setPrecioCarrito(precioAcumulado);   
    }, [listaPedidosCarrito]);

    const toggleInput = (index) => {
		let state = true;
		if(showInputs[index] === true){
			state = false;
		}		
		const updatedShowInputs = Array(showInputs.length).fill(false); // Inicializa todos los estados en false
		updatedShowInputs[index] = state; // Cambia el estado del índice al recibirlo
		setShowInputs(updatedShowInputs);
	};	  

    const HandleSubmit = (event, idListaPedido) => {
		event.preventDefault();		
        const requestBody = JSON.stringify({
            idListaPedido: idListaPedido
        });
        
        fetch('http://137.184.41.188:4000/api/' + "carrito/removerListado", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
        })
		.then(response => {
			if (response.status === 500) {
				alert('Se produjo un error con la solicitud');
			} 
			else if(response.status === 200){
				//--------------> retornar a home
                window.location.reload();						
			}
		})
		.catch(error => console.log(error));
	};

	return (        	
        <>
            <NavBarUser />            
            <div className="centered-form ">			
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>CARRITO</h1>
                    <div className='container mt-2'>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Empresa</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaPedidosCarrito.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.idListaPedidos}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.fecha}</td>
                                        <td>{item.empresa}</td>
                                        <td>{item.precio}</td>           
                                        <td>
                                            <button className='btn btn-outline-primary me-2' onClick={() => {
                                                toggleInput(index, true);
                                            }}><i className="fa-solid fa-check"></i></button>
                                            <button className='btn btn-outline-danger' onClick={(event) => HandleSubmit(event, item.idListaPedidos)}><i className="fa-solid fa-xmark"></i></button>                                            
                                        </td>                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <FormFinalizarCarrito precioCarrito={precioCarrito} direccion={direccion} setDireccion={setDireccion}/>
                    </div>
                    {listaPedidosCarrito.map((item, index) => (                /* si quieres que no sea editable, pon isEditable={false} como parametro */                    
                       <ModalListaPedidos index={index} idListaPedido={item.idListaPedidos} modalShow={showInputs} setModalShow={toggleInput} isEditable={true}/>
                    ))}                    
                </div>                
            </div>	
            
            
        </>        
    );
};

const FormFinalizarCarrito = ({precioCarrito, direccion, setDireccion}) => {
    const history = useHistory();	
    const correo = localStorage.getItem('correo');
    const api = "carrito/finalizarCarrito";
    const nuevaPagina = "/navegacionCategoria";
    const msgAlert = "El carrito cerro y los pedidos ya fueron solicitados" ;

    if (!correo) {
    // Mostrar mensaje de error o realizar una acción alternativa
    console.error('El correo del usuario no está disponible');
    }

    const HandleSubmit = (event) => {
		event.preventDefault();		
        const requestBody = JSON.stringify({
        direccion: direccion,
        correo: correo
        });
        
        fetch('http://137.184.41.188:4000/api/' + api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
        })
		.then(response => {
			if (response.status === 500) {
				alert('Se produjo un error con la solicitud');
			} 
			else if(response.status === 200){
				alert(msgAlert)
				//--------------> retornar a home                
                history.push(nuevaPagina);	                				
			}
		})
		.catch(error => console.log(error));
	};

    return (
        <Form onSubmit={HandleSubmit}>
            <InputGroup className="mb-3">
                <InputGroup.Text>Q</InputGroup.Text>
                <InputGroup.Text>{precioCarrito}</InputGroup.Text>
                <InputGroup.Text> Ingrese la direccion a enviar </InputGroup.Text>
                <Form.Control required onChange={(e) => setDireccion(e.target.value)}/>
                <Button type="submit" className="button-form-dev">Cerrar carrito</Button>
            </InputGroup>
        </Form>
    );
}

export default CarritoCompraUsuario;
//<button className='btn btn-outline-danger' ><i className="fa-solid fa-xmark"></i> </button> PENDIENTE
/*showInputs[index] && */