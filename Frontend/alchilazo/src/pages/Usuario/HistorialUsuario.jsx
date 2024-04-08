import NavBarUser from '../../components/User/NavBarUser';
import '../../styles/style-delivery-reg.css';
import React, { useState, useEffect } from 'react';
import HttpClientService from '../../services/HttpClientService.jsx';
import ModalListaPedidos from '../../components/Pedido/ModalListaPedidos.jsx';
import Swal from 'sweetalert2';

const HistorialUsuario = () => {

    const [userRequest, setuserRequest] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio

    // Pide informacion a la BD sobre la lista de pedidos del usuario que se logueo.
    useEffect(() => {
        getUserOrdersState()

        return () => {
        }

    }, [])

    useEffect(() => {
        setShowInputs(Array(userRequest.length).fill(false));
    }, [userRequest]);

    /**
     * getUserOrdersState: Con la informacion del usuario se obtiene la ListaPedidos registrados a este
     * en especifico. Otorgando informacion sobre el estado del pedido y si ya tiene asignado un repartidor
     */
    const getUserOrdersState = () => {

        // Peticion al servicio por la lista de pedidos del usuario segun el estado de estos
        const httpclient = new HttpClientService();
        httpclient.post('/pedido/estado', { correo: localStorage.getItem('correo'), itsState: false }).then(res => {
            if (!res.error) {
                setuserRequest(res.orders);
            }
        });

    };

    const toggleInput = (index) => {
        let state = true;
        if (showInputs[index] === true) {
            state = false;
        }
        const updatedShowInputs = Array(showInputs.length).fill(false); // Inicializa todos los estados en false
        updatedShowInputs[index] = state; // Cambia el estado del índice al recibirlo
        setShowInputs(updatedShowInputs);
    };

    const handleRatingClick = (selectedRating, item) => {

        // Se actualiza la calificacion en ListaPedidos a peticion de la calificacion del usuario por el servicio
        const httpClientService = new HttpClientService();
        httpClientService.post('pedido/rating', { id: item.idListaPedidos, rating: selectedRating}).then(res => {
            if (!res.error) {
                getUserOrdersState()
                Swal.fire({ title: res.message, icon: 'success' });
            } else {
                getUserOrdersState()
                Swal.fire({ title: res.error, iccon: 'error' });
            }
        })
    };

    const handleOrderAgain = (item) => {

        // Se actualiza la calificacion en ListaPedidos a peticion de la calificacion del usuario por el servicio
        const httpClientService = new HttpClientService();
        httpClientService.post('/carrito/resolicitarListaPedidos', { correo: localStorage.getItem('correo'), idListaPedidos: item.idListaPedidos, empresa: item.empresa}).then(res => {
            if (res.statusCode === 200) {
                getUserOrdersState()
                Swal.fire({ title: res.msg, icon: 'success' });
            } else {
                getUserOrdersState()
                Swal.fire({ title: res.msg, iccon: 'error' });
            }
        })
    };

    // Codigo HTML que se mostrara en el PAGE de HistorialUsuario
    return (
        <>
            <NavBarUser />
            <div className="centered-form ">
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>HISTORIAL DE TUS PEDIDOS</h1>
                    <div className='container mt-2'>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Restaurante</th>
                                    <th scope="col">Direccion restaurante</th>
                                    <th scope='col'>Descripcion</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Calificacion</th>
                                    <th scope="col">Pedidos</th>
                                    <th scope="col">Pedir de nuevo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequest.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.nombre}</td>
                                        <td>{item.direccion}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.fecha}</td>
                                        <td>Q.{item.precio}</td>
                                        <td>{item.nombreEstado}</td>
                                        <td>{[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => handleRatingClick(star, item)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {star <= item.calificacion ? '★' : '☆'}
                                            </span>
                                        ))}</td>
                                        <td>
                                            <button className='btn btn-outline-info me-2' onClick={() => {
                                                toggleInput(index);
                                            }}><i className="fa-solid fa-bars"></i></button>
                                        </td>
                                        <td>
                                            <button className='btn btn-outline-primary me-2' onClick={() => {
                                                handleOrderAgain(item);
                                            }}><i className="fa-solid fa-check-square"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {userRequest.map((item, index) => (                /* si quieres que no sea editable, pon isEditable={false} como parametro */
                        <ModalListaPedidos index={index} idListaPedido={item.idListaPedidos} modalShow={showInputs} setModalShow={toggleInput} isEditable={false} />
                    ))}
                </div>
            </div>
        </>

    );
};


export default HistorialUsuario;
