import NavBarUser from '../../components/User/NavBarUser';
import '../../styles/style-delivery-reg.css';
import React, { useState, useEffect } from 'react';
import HttpClientService from '../../services/HttpClientService.jsx';
import ModalListaPedidos from '../../components/Pedido/ModalListaPedidos.jsx';

const EstadoPedidos = () => {

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
        httpclient.post('/pedido/estado', { correo: localStorage.getItem('correo'), itsState: true }).then(res => {
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

    // Codigo HTML que se mostrara en el PAGE de EstadoPedidos
    return (
        <>
            <NavBarUser />
            <div className="centered-form ">
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>ESTADO DE TUS PEDIDOS</h1>
                    <div className='container mt-2'>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tú</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Repartidor</th>
                                    <th scope="col">Celular repartidor</th>
                                    <th scope="col">Pedidos</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequest.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.nombre}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.fecha}</td>
                                        <td>Q.{item.precio}</td>
                                        <td>{item.nombreEstado}</td>
                                        <td>{item.nomRepartidor}&nbsp;{item.apellido}</td>
                                        <td>{item.celular}</td>
                                        <td>
                                            <button className='btn btn-outline-info me-2' onClick={() => {
                                                toggleInput(index);
                                            }}><i className="fa-solid fa-bars"></i></button>
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


export default EstadoPedidos;
