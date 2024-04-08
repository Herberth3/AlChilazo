import React from 'react'

export const TopSaleReport = (props) => {
    return (
        <div className='container mt-4'>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Imagen</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">Total ventas</th>
                    </tr>
                </thead>
                <tbody>
                    {props.saleReport.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.nombreProducto}</td>
                            <td>{item.nombreCategoria}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.precio}</td>
                            <td><img style={{width:'50px'}} src={item.foto} alt="" /></td>
                            <td>{item.nombreEmpresa}</td>
                            <td>{item.totalVentas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
