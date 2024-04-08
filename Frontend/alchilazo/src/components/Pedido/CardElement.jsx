import '../../styles/RealizarPedidosUsuario.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
//import React, { useState, useEffect } from 'react';
//import { useHistory } from "react-router-dom";

/**
 * CardElement puede ser un Producto o un Combo (descripcion general del combo)
 * @param {*} param0 
 * @returns 
 */
const CardElement = ({
    codigo = 0,
    nombre = "Nombre",
    categoria = "cena",
    precio = 23.6,
    empresa = "------",
    descripcion = "Descripcion de producto",
    foto = "",
    oferta = "0",
    tipo = "Producto"
}) => {
return (
           
    <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" className='image-card' src={foto} />
        <Card.Body>
            <Card.Title>{tipo} : {nombre}</Card.Title>
            <Card.Text>
                Descripcion: {descripcion}
            </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
            <ListGroup.Item>Categoria: {categoria}</ListGroup.Item>
            <ListGroup.Item>Empresa: {empresa}</ListGroup.Item>
            <ListGroup.Item>Precio: Q {precio}</ListGroup.Item>
            <ListGroup.Item>Oferta: {oferta === "0" ? "No" : "si"}</ListGroup.Item>
        </ListGroup>
    </Card>            
);
}

export default CardElement;

