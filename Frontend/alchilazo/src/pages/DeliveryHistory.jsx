import NavbarRepartidor from '../components/Delivery/NavbarRepartidor.jsx';
import '../styles/style-delivery-reg.css';
import React, { useState, useEffect } from 'react';
import HttpClientService from '../services/HttpClientService.jsx';
import ModalListaPedidos from '../components/Pedido/ModalListaPedidos.jsx';

const DeliveryHistory = () => {

    const [deliveryRequest, setdeliveryRequest] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio
    const [filters, setFilters] = useState({
        nombreEstado: '',
        fecha: '',
        descripcion: ''
    });

    // Pide informacion a la BD sobre la lista de pedidos de la empresa que se logueo.
    useEffect(() => {
        getDeliveryRequest()

        return () => {
        }

    }, [])

    useEffect(() => {
        setShowInputs(Array(deliveryRequest.length).fill(false));
    }, [deliveryRequest]);

    /**
     * getDeliveryRequest: Primero obtiene la infomacion sobre el repartidor registrado por medio de su correo
     * Segundo, se obtiene el idRepartidor que se usara para obtener la ListaPedidos registrados a este repartidor
     * en especifico.
     */
    const getDeliveryRequest = () => {

        // Peticion al servicio por la ubicacion (departamento y municipio) del Repartidor
        const httpclient = new HttpClientService();
        httpclient.post('/delivery/profile', { correo: localStorage.getItem('correo') }).then(res => {
            if (!res.error) {

                const departamento = res.data.departamento;
                const municipio = res.data.ciudad;
                const idRepartidor = res.data.idrepartidor;

                // Peticion al servicio por la LISTAPEDIDOS que el repartidor ya entrego
                httpclient.post('/delivery/orders', { departamento: departamento, municipio: municipio, estado: 7, idrepartidor: idRepartidor, itsRequest: false }).then(res2 => {
                    if (!res2.error) {
                        setdeliveryRequest(res2.orders);
                    }
                })
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredData = deliveryRequest.filter((item) =>
        item.nombreEstado.toLowerCase().includes(filters.nombreEstado.toLowerCase()) &&
        item.fecha.toString().includes(filters.fecha.toLowerCase()) &&
        item.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase())
    );

    // Codigo HTML que se mostrara en el PAGE de EntregasRepartidor
    return (
        <>
            <NavbarRepartidor />
            <div className="centered-form ">
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>HISTORIAL DE ENTREGAS</h1>
                    <div className='container mt-2'>
                        <input
                            type="text"
                            placeholder="Buscar por estado"
                            name='nombreEstado'
                            value={filters.nombreEstado}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por fecha"
                            name='fecha'
                            value={filters.fecha}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por descripcion"
                            name='descripcion'
                            value={filters.descripcion}
                            onChange={handleChange}
                        />
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Comprador</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Departamento</th>
                                    <th scope="col">Municipio</th>
                                    <th scope="col">Direccion</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Calificacion</th>
                                    <th scope="col">Pedidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.idListaPedidos}</td>
                                        <td>{item.nombre}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.departamento}</td>
                                        <td>{item.municipio}</td>
                                        <td>{item.direccion}</td>
                                        <td>{item.fecha}</td>
                                        <td>Q.{item.precio}</td>
                                        <td>{item.nombreEstado}</td>
                                        <td>{item.calificacion}</td>
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
                    {deliveryRequest.map((item, index) => (                /* si quieres que no sea editable, pon isEditable={false} como parametro */
                        <ModalListaPedidos index={index} idListaPedido={item.idListaPedidos} modalShow={showInputs} setModalShow={toggleInput} isEditable={false} />
                    ))}
                </div>
            </div>
        </>

    );
};


export default DeliveryHistory;
