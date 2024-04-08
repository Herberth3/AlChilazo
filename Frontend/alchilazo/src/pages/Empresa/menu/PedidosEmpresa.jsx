import NavBarEmpresa from "../../../components/Empresa/NavBarEmpresa";
import { useEffect } from "react";
import { useState } from "react";
import HttpClientService from '../../../services/HttpClientService';
import { HttpEmpresaService } from "../../../services/HttpEmpresaService";
import Swal from "sweetalert2";
import ModalListaPedidos from "../../../components/Pedido/ModalListaPedidos";

const PedidosEmpresa = () => {

    const [deliveryRequest, setdeliveryRequest] = useState([]);
    const [showInputs, setShowInputs] = useState([]);//estado inicial array vacio

    // Pide informacion a la BD sobre la lista de pedidos de la empresa que se logueo.
    useEffect(() => {
        getDeliveryRequest()

        return () => {
        }

    }, [])

    useEffect(() => {
        setShowInputs(Array(deliveryRequest.length).fill(false));
        //const precioAcumulado = deliveryRequest.reduce((acumulado, item) => acumulado + item.precio, 0);
        //setPrecioCarrito(precioAcumulado);   
    }, [deliveryRequest]);

    /**
     * getDeliveryRequest: Primero obtiene la infomacion sobre la empresa registrada por medio de su correo
     * Segundo, se obtiene el idEmpresa que se usara para obtener la ListaPedidos registrados a esta empresa
     * en especifico.
     */
    const getDeliveryRequest = () => {
        // Peticion al servicio por el ID de la empresa
        HttpEmpresaService.getEmpresa(localStorage.getItem('correo'))
            .then((res) => {
                if (res.error === undefined) {

                    // Peticion al servicion por la DIRECCION (idDepartamento, idMunicipio) de la empresa
                    HttpEmpresaService.obtenerDirecciones(localStorage.getItem('correo'))
                        .then((resultDireccion) => {
                            if (resultDireccion.error === undefined) {
                                const idDepartamento = resultDireccion[0].idDepartamento;
                                const idMunicipio = resultDireccion[0].idCiudad;

                                // Peticion al servicio por la LISTAPEDIDOS a esa empresa
                                HttpEmpresaService.getListaPedidos(res.idEmpresa, idDepartamento, idMunicipio)
                                    .then((resultPedidos) => {
                                        if (resultPedidos.error === undefined) {
                                            // Se actualiza la variable que contendra la lista de pedidos de la empresa
                                            setdeliveryRequest(resultPedidos);
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(error => {
                console.log(error);
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
            title: 'Aprobar la solicitud',
            text: '¿Desea aprobar la solicitud y notificar a un repartidor?',
            showCancelButton: true,
            confirmButtonText: 'Si, aprobar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {

                const httpClientService = new HttpClientService()
                httpClientService.post('empresa/approveOrder', { id: item.idListaPedidos, estado: 4 }).then(res => {
                    if (!res.error) {
                        getDeliveryRequest()
                        Swal.fire({ title: res.message, icon: 'success' })
                    } else {
                        getDeliveryRequest()
                        Swal.fire({ title: res.error, iccon: 'error' })
                    }
                })
            }
        })
    }

    // Codigo HTML que se mostrara en el PAGE de PedidosEMpresa
    return (
        <>
            <NavBarEmpresa />
            <div className='background-empresa-menu'>
                <div className="cardEmpresa container">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Codigo</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Departamento</th>
                                <th scope="col">Municipio</th>
                                <th scope="col">Direccion</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Empresa</th>
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
                                    <td>{item.descripcion}</td>
                                    <td>{item.departamento}</td>
                                    <td>{item.municipio}</td>
                                    <td>{item.direccion}</td>
                                    <td>{item.fecha}</td>
                                    <td>{item.nombre}</td>
                                    <td>Q.{item.precio}</td>
                                    <td>
                                        <button className='btn btn-outline-info me-2' onClick={() => {
                                            toggleInput(index, true);
                                        }}><i className="fa-solid fa-bars"></i></button>
                                    </td>
                                    <td>
                                        <button className='btn btn-outline-success me-2' onClick={() => approveRequest(item)}><i className="fa-solid fa-check">Listo</i></button>
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
        </>
    );

}


export default PedidosEmpresa;