import { FootBar } from "./FootBar";

const WhoWeAre = ({setPage}) => {

    return(
        <div className="slide" style={{backgroundImage:'url("https://images.pexels.com/photos/1639563/pexels-photo-1639563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")'}}>
            <div className="center">
                <h2>¿Quiénes Somos?</h2>
                <div className="icon-wrapper">
                    <i className="flaticon-price"></i>
                </div>
                <p>Somos una aplicación dedicada a los pedidos online que nuestros repartidores entregarán gustosamente en la entrada
                    de tu casa. Contamos con una gran de establecimientos de distinta índole, desde restaurantes hasta farmacias. Así que 
                    prueba Alchilazo ya.
                </p>
                <FootBar num={1} setPage={setPage}/>
            </div>
        </div>
    );
}

export default WhoWeAre;