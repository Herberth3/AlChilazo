import NavbarRepartidor from '../components/Delivery/NavbarRepartidor.jsx';
import '../styles/style-delivery-reg.css';
import React, { useState, useEffect } from 'react';
import HttpClientService from '../services/HttpClientService.jsx';
import Swal from 'sweetalert2';
import ModalListaPedidos from '../components/Pedido/ModalListaPedidos.jsx';

const DeliveryCompleted = () => {

    const [deliveryRequest, setdeliveryRequest] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio
    const [idDelivery, setIdDelivery] = useState(0);
    const [idCarrito, setIdCarrito] = useState(0);
    const [precioPedido, setPrecioPedido] = useState(0);

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
                // Almacenar datos del repartidor, solo para llenar requisito de la actualizacion (pero no se utiliza en este caso)
                setIdDelivery(idRepartidor);

                // Peticion al servicio por la LISTAPEDIDOS que el repartidor se asigno
                httpclient.post('/delivery/orders', { departamento: departamento, municipio: municipio, estado: 6, idrepartidor: idRepartidor, itsRequest: false }).then(res2 => {
                    if (!res2.error) {
                        setdeliveryRequest(res2.orders);
                        // La respuesta siempre va a ser un arreglo de pedidos, pero como el repartidos solo se puede asignar
                        // a una entrega, entonces se pude almacenar el carrito y el precio del primer objeto como dato de la comision
                        // del repartidor en esa entrega en especifico.
                        if (res2.orders.length !== 0) {
                            // Cuando retorna la lista vacia, idcarrito y precion retorna un undefined, por eso la validacion
                            setIdCarrito(res2.orders[0].idcarrito);
                            setPrecioPedido(res2.orders[0].precio);
                        }
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

        Swal.fire({
            icon: 'info',
            title: 'Confirmar entrega',
            text: '¿Seguro quiere confirmar la entrega?',
            showCancelButton: true,
            confirmButtonText: 'Si, aprobar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {

                // Si el repartidor hace una entrega, se actualiza el estado del pedido a 7 ("Orden Entregada")
                // itsRequest: se esta utilizando el mismo ENDPOINT con DeliveryOrders, valida que QUERY se va a utilizar
                const httpClientService = new HttpClientService();
                httpClientService.post('delivery/approveOrder', { id: item.idListaPedidos, estado: 7, idRepartidor: idDelivery, itsRequest: false }).then(res => {
                    if (!res.error) {
                        getDeliveryRequest()
                        Swal.fire({ title: res.message, icon: 'success' });

                        // Envio al servicio, los datos de la comision generada para el repartidor por haber hecho la entrega del pedido
                        httpClientService.post('/delivery/setcomission', { idrepartidor: idDelivery, idcarrito: idCarrito, precio: precioPedido }).then(res2 => {
                            if (!res2.error) {
                                Swal.fire({ title: res2.message, icon: 'success' });
                            } else {
                                Swal.fire({ title: res2.error, iccon: 'error' });
                            }
                        })
                    } else {
                        getDeliveryRequest()
                        Swal.fire({ title: res.error, iccon: 'error' });
                    }
                })
            }
        });
    };

    // Codigo HTML que se mostrara en el PAGE de EntregasRepartidor
    return (
        <>
            <NavbarRepartidor />
            <div className="centered-form ">
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>ENTREGAS ASIGNADAS</h1>
                    <div className='container mt-2'>
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
                                {deliveryRequest.map((item, index) => (
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
                                            <button className='btn btn-outline-success me-2' onClick={() => approveRequest(item)}><i className="fa-solid fa-check">Finalizar</i></button>
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


export default DeliveryCompleted;
