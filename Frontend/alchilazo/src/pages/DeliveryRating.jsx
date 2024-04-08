import {useState, useEffect} from 'react';
import NavbarRepartidor from '../components/Delivery/NavbarRepartidor';
import HttpClientService from '../services/HttpClientService';

const DeliveryRating = () => {
    const [calificacion, setCalificacion] = useState(0);

    useEffect(() => {
        let httpClient = new HttpClientService();
        httpClient.post('delivery/promedio', {correo: localStorage.getItem('correo')})
            .then(response => {
                setCalificacion(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    return(
        <>
            <NavbarRepartidor />
            <div className="centered-form">			
                <div className="modal-content container" 
                    style={{
                        height: '25vh',
                        overflowY: 'hidedn',
                    }}
                >
                    <h1 style={{color:'white', fontWeight: 'bolder'}}>CALIFICACIÓN</h1>
                    {(calificacion != undefined &&
                        calificacion != null)? (
                          <>
                                <h1 style={{color:'black', fontWeight: 'bolder'}}>{calificacion}</h1>
                          </>  
                        ):(
                            <>
                                <h1 style={{color:'black', fontWeight: 'bolder'}}>SIN CALIFICACIÓN</h1>
                            </>
                        ) }
                    
                </div>
            </div>
        </>
    )

}


export default DeliveryRating;