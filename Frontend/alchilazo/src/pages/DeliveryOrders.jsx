import NavbarRepartidor from '../components/Delivery/NavbarRepartidor.jsx';
import '../styles/style-delivery-reg.css';
import React, { useState, useEffect } from 'react';
import HttpClientService from '../services/HttpClientService.jsx';
import Swal from 'sweetalert2';
import ModalListaPedidos from '../components/Pedido/ModalListaPedidos.jsx';

const DeliveryOrders = () => {

    const [deliveryRequest, setdeliveryRequest] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio
    const [idDelivery, setIdDelivery] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');// Estado para manejar el filtro

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
                // Almacenar datos del repartidor, para la actualizacion a la lista de pedidos que acepto entregar
                setIdDelivery(idRepartidor);

                // Peticion al servicio por los LISTAPEDIDOS que las empresas ya APROBARON
                httpclient.post('/delivery/orders', { departamento: departamento, municipio: municipio, estado: 4, idrepartidor: idRepartidor, itsRequest: true }).then(res2 => {
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

    const approveRequest = (item) => {

        // Peticion al servicio de una LISTAPEDIDOS donde el estado este en 6 ("Orden en camino") y que este asignado al repartidor actual
        const httpClientService = new HttpClientService();
        httpClientService.post('delivery/orderActivated', { estado: 6, idRepartidor: idDelivery }).then(res => {

            if (!res.error) {

                /**
                 * Si existe una LISTAPEDIDOS con estado 7 y asignado al repartidor, muestra una advertencia de que solo puede
                 * tener una entrega asignada.
                 * De lo contrario se valida si quiere solicitar la entrega
                 */
                if (res.orders.length !== 0) {
                    Swal.fire({ title: res.message, iccon: 'error' });
                } else {

                    Swal.fire({
                        icon: 'info',
                        title: 'Confirmar aceptacion',
                        text: '¿Desea aceptar la entrega?',
                        showCancelButton: true,
                        confirmButtonText: 'Si, aprobar',
                        cancelButtonText: 'Cancelar',
                    }).then((result) => {
                        if (result.isConfirmed) {

                            // Si el repartidor se asigna una entrega, se actualiza el estado del pedido a 6 ("Orden en camino") y se asigna un repartidor
                            // itsRequest: se esta utilizando el mismo ENDPOINT con DeliveryCompleted, valida que QUERY se va a utilizar
                            httpClientService.post('delivery/approveOrder', { id: item.idListaPedidos, estado: 6, idRepartidor: idDelivery, itsRequest: true }).then(res => {
                                if (!res.error) {
                                    getDeliveryRequest()
                                    Swal.fire({ title: res.message, icon: 'success' })
                                } else {
                                    getDeliveryRequest()
                                    Swal.fire({ title: res.error, iccon: 'error' })
                                }
                            })
                        }
                    });
                }


            } else {
                Swal.fire({ title: res.error, iccon: 'error' })
            }
        });
    };

    // Constantes para manejar el filtro
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = deliveryRequest.filter((item) =>
        item.fecha.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Codigo HTML que se mostrara en el PAGE de EntregasRepartidor
    return (
        <>
            <NavbarRepartidor />
            <div className="centered-form ">
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>SOLICITUDES AUTORIZADAS</h1>
                    <div className='container mt-2'>
                        <input
                            type="text"
                            placeholder="Buscar por fecha"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Comprador</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Celular</th>
                                    <th scope="col">Departamento</th>
                                    <th scope="col">Municipio</th>
                                    <th scope="col">Direccion</th>
                                    <th scope="col">Empresa</th>
                                    <th scope="col">Direccion Empresa</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Pedidos</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.idListaPedidos}</td>
                                        <td>{item.nombre}</td>
                                        <td>{item.apellido}</td>
                                        <td>{item.celular}</td>
                                        <td>{item.departamento}</td>
                                        <td>{item.municipio}</td>
                                        <td>{item.direccion}</td>
                                        <td>{item.nomEmpresa}</td>
                                        <td>{item.dirEmpresa}</td>
                                        <td>{item.fecha}</td>
                                        <td>Q.{item.precio}</td>
                                        <td>
                                            <button className='btn btn-outline-info me-2' onClick={() => {
                                                toggleInput(index);
                                            }}><i className="fa-solid fa-bars"></i></button>
                                        </td>
                                        <td>
                                            <button className='btn btn-outline-success me-2' onClick={() => approveRequest(item)}><i className="fa-solid fa-check">Recoger</i></button>
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


export default DeliveryOrders;
