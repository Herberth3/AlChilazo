import React from 'react'

const UsersReport = (props) => {

    return (
        <div className='bg-dansger mt-3'>
            <h5>Cantidad de usuarios: <strong>4</strong> </h5>
            <table className="table table-hover table-striped mt-3">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">Celular</th>
                        <th scope="col">Direccion</th>
                        <th scope="col">Departamento</th>
                        <th scope="col">Municipio</th>
                        <th scope="col">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {props.userReport.users.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.nombre}</td>
                            <td>{item.apellido}</td>
                            <td>{item.correo}</td>
                            <td>{item.celular}</td>
                            <td>{item.direccion}</td>
                            <td>{item.municipio}</td>
                            <td>{item.departamento}</td>
                            <td>{item.estado == 1 ? 'Activo' : 'Desactivado'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='row'>
                <table className="table table-hover table-striped mt-3 col me-4">
                    <thead className='table-warning'>
                        <tr className='text-center'>
                            <th scope="col" colSpan={3} >Usuarios por dia</th>
                        </tr>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Dia</th>
                            <th scope="col">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userReport.perDay.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.Fecha}</td>
                                <td>{item.Cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="table table-hover table-striped mt-3 col">
                    <thead className='table-success'>
                        <tr className='text-center'>
                            <th scope="col" colSpan={3} >Usuarios por mes</th>
                        </tr>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Mes</th>
                            <th scope="col">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userReport.perMonth.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.Mes}</td>
                                <td>{item.Cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='row'>
                <table className="table table-hover table-striped mt-3 col">
                    <thead className='table-info'>
                        <tr className='text-center'>
                            <th scope="col" colSpan={3} >Usuarios por Año</th>
                        </tr>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Año</th>
                            <th scope="col">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userReport.perYear.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.Anio}</td>
                                <td>{item.Cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='col'>

                </div>
            </div>
        </div>



    )
}

export default UsersReport