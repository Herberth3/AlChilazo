import '../../styles/RealizarPedidosUsuario.css';
import CardElement from './CardElement';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

//import React, { useState, useEffect } from 'react';
//import { useHistory } from "react-router-dom";
/**
 * Cada AccordionItemElement es un Pedido
 * @param {*} index 
 * @returns 
 */
const AccordionItemElement = ({
    index,
    idListaPedido = 0,
    idPedido = 0, 
    idProducto = 0,
    idCombo = 0,
    cantidad = 0,
    precio = 0,
    descripcion = "Descripcion pedido",
    isEditable = true    
}) => {    
    const [elementoDescripcion, setElementoDescripcion] = useState();//descripcion de pedido o combo
    const [listaProductos, setListaProductos] = useState([]);//variable para el listado de productos si es un combo   
    const [cardElements, setCardElements] = useState([]);
    const [dataState, setDataState] = useState(false);
    const [firstFetchCompleted, setFirstFetchCompleted] = useState(false); // Variable para hacer un seguimiento del primer fetch
    const [secondFetchCompleted, setSecondFetchCompleted] = useState(false); // Variable para hacer un seguimiento del segundo fetch
    const [precioUnitario, setPrecioUnitario] = useState(null);
    const [pedidoDatos, setPedidoDatos] = useState({
        idListaPedido: idListaPedido,
        idPedido: idPedido,
        cantidad: cantidad,
        precio: precio,
        descripcion: descripcion,
        idProducto: idProducto,
        idCombo: idCombo
      });

    const setPedidoDato = (nombre, valor) => {
        setPedidoDatos((prevPedidoDatos) => ({
            ...prevPedidoDatos,
            [nombre]: valor,
        }));
    };
    
    const onChange = (e, targetAttr) => {
        let newValue;
        newValue = e.target.value;        
        setPedidoDato(targetAttr, newValue);
        if(targetAttr === 'cantidad'){
            setPedidoDato('precio', precioUnitario*newValue);
        }
    };

    const agregarProducto = (producto) => {//agregamos un elemento por separado
        //setListaProductos(prevLista => [producto]);
        setElementoDescripcion(producto);
        //console.log("Se agrega el ELEMENTO : "+ JSON.stringify(producto));
        //console.log("LISTADO ACTUAL: "+ JSON.stringify(listaProductos));
    };

    const agregarListaProductos = (lista) => {//agregamos varios elementos
        //setListaProductos(prevLista => [...prevLista, ...lista]);
        setListaProductos(lista);
        //console.log("Se agrega el LISTADO: "+ JSON.stringify(lista));
        //console.log("LISTADO ACTUAL: "+ JSON.stringify(listaProductos));
    };

    const fetchData = (api, requestBody, successCallback, finalCallback) => {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        };
      
        // Realizar la solicitud fetch
        fetch("http://137.184.41.188:4000/api/" + api, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            //console.log(JSON.stringify(result));
            if (result.statusCode === 200) {
              successCallback(result.data);               
              if (finalCallback) {
                finalCallback(); // Ejecutar la función finalCallback si se proporciona
              }
            }
          })
          .catch((error) => console.error(error));
      };
    
    // En tu componente
    useEffect(() => {
        //console.log("EL ID DEL PRODUCTO ES: " + idProducto + " Y EL DEL COMBO ES: " + idCombo);
    if (idProducto === 0 || idProducto === null || idProducto === undefined) {
        const api = "pedido/getCombo";//api para datos combo
        const api2 = "pedido/getProductosCombo";//api para productos combo
        // Realizar el primer fetch para obtener los datos del combo
        fetchData(api, { codigo: idCombo }, agregarProducto, () => {            
            // Callback al finalizar el primer fetch
            // Realizar el segundo fetch para obtener los productos del combo
            fetchData(api2, { codigo: idCombo }, agregarListaProductos, () => {
            // Callback al finalizar el segundo fetch
            setSecondFetchCompleted(true);
            });
        });
    } else {
        const api = "pedido/getProducto";//api para datos Producto
        // Use effect para cargar productos del combo
        // Realizar el fetch para obtener los datos del producto individual
        fetchData(api, { codigo: idProducto }, agregarProducto, () => {
            // Callback al finalizar el fetch
            setSecondFetchCompleted(true);
        });
    }
    }, []);

    useEffect(() => {
        if (secondFetchCompleted) {
            setDataState(true);
        }
    }, [secondFetchCompleted]);     
    /*
    useEffect(() => {        
        
      }, [secondFetchCompleted, dataState, listaProductos, precioUnitario]);
*/
    useEffect(() => {
        //AGREGAR elementoDescripcion como primer elemento de cardElements       
        // Actualizar cardElements cuando listaProductos cambie
        setCardElements(listaProductos.map((item, index) => (
          <CardElement key={(idProducto === 0 || idProducto === null || idProducto === undefined) ? (idCombo + "_p_" + index) : (idProducto + "_p_" + index)} {...item} tipo={"Producto"}/>
        )));

        if (precioUnitario === null && dataState) {
            const precio = elementoDescripcion.precio; // Suponiendo que el precio está en el primer elemento de listaProductos
            setPrecioUnitario(precio);
        }
      }, [dataState]);

    const tipo = (idProducto === 0 || idProducto === null || idProducto === undefined) ? "Combo": "Producto";
    return (
        
        <Accordion.Item eventKey={`${index}`}>
            <Accordion.Header>Pedido No.{index} {idPedido === 0? "": "con codigo: <" + idPedido + ">" }</Accordion.Header>
            <Accordion.Body className='CardContainer'>      
                {isEditable === true ? <CardNewPedido onChange={onChange} pedidoDatos={pedidoDatos} precioUnitario={precioUnitario} tipo={tipo}/> : <CardPedido pedidoDatos={pedidoDatos} tipo={tipo}/>}
                <CardElement key={(idPedido === 0) ? (idCombo + "__" + index) : (idPedido + "__" + index)} {...elementoDescripcion} tipo={tipo}/>
                {cardElements}
            </Accordion.Body>
        </Accordion.Item>        
    );
}

const CardPedido = ({pedidoDatos, tipo}) =>{
    return (
        <Card style={{ width: '18rem' }} key={"idPedido_" + pedidoDatos.idPedido}>
            <Card.Body>
                <Card.Title>Pedido: {pedidoDatos.idPedido}</Card.Title>
                <Card.Text>
                    Descripcion: {pedidoDatos.descripcion}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">                        
                <ListGroup.Item>Tipo: {tipo} </ListGroup.Item>
                <ListGroup.Item>Cantidad: {pedidoDatos.cantidad}</ListGroup.Item>
                <ListGroup.Item>Precio Total: {pedidoDatos.precio}</ListGroup.Item>
            </ListGroup>
        </Card>    
    );
}

const CardNewPedido = ({onChange, pedidoDatos, precioUnitario, tipo}) =>{//se reciben los datos de un producto
    const history = useHistory();	
    const correo = localStorage.getItem('correo');
    const isInsert = (pedidoDatos.idPedido === 0) ? true: false;//si es true, se hace un insert, sino se hace un update
    const api = (isInsert === true) ? "pedido/insertPedido" : "carrito/updatePedido";
    const nuevaPagina = (isInsert === true) ? "/navegacionCategoria" : "/carrito";
    const msgAlert = (isInsert === true) ? "El pedido se registro de forma correcta" : "El pedido se modificó de forma correcta";

    if (!correo) {
    // Mostrar mensaje de error o realizar una acción alternativa
    console.error('El correo del usuario no está disponible');
    }

    const removerHandleSubmit = (event) => {
        const api = "carrito/removerPedido";
        HandleSubmit(event, api);
        console.log(api);
    }

    const HandleSubmit = (event, api) => {
		console.log("Valores actuales de datos:", pedidoDatos);
		event.preventDefault();		
        const requestBody = JSON.stringify({
        ...pedidoDatos,
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
                if(isInsert){
                    history.push(nuevaPagina);	
                }else{
                    window.location.reload();	
                }						
			}
		})
		.catch(error => console.log(error));
	};
    
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{isInsert? "Nuevo Pedido": "Pedido"}</Card.Title>
                <Card.Text>
                    <Form onSubmit={(event) => HandleSubmit(event, api)}>
                        <Form.Group onChange={(e) => onChange(e, 'descripcion')} className="mb-3" controlId="descripcion_nuevo_pedido">
                            <Form.Label>Descripcion:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={pedidoDatos.descripcion} />
                        </Form.Group>
                        <InputGroup onChange={(e) => onChange(e, 'cantidad')} className="mb-3" controlId="cantidad_nuevo_pedido">
                            <InputGroup.Text>Cantidad</InputGroup.Text>
                            <Form.Control type="number" placeholder="0" min="1" value={pedidoDatos.cantidad}/>
                        </InputGroup>
                        <InputGroup controlId="acciones">
                            <InputGroup.Text>Accion</InputGroup.Text>
                            <Button type="submit" className="button-card-pedido">{isInsert ? "Ralizar Pedido": "Modificar"}</Button>
                            {!isInsert && <button className='btn btn-outline-danger' onClick={(event) => removerHandleSubmit(event)}><i className="fa-solid fa-xmark"></i></button>}
                        </InputGroup>
                                                                        
                    </Form>                    
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">                        
            <ListGroup.Item>Tipo: {tipo}</ListGroup.Item>
                <ListGroup.Item>Precio: Q {precioUnitario}</ListGroup.Item>
                <ListGroup.Item>Precio Total Q: {pedidoDatos.precio}</ListGroup.Item>                
                
            </ListGroup>
        </Card>    
    );
}

export default AccordionItemElement;

