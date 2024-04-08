import { FootBar } from "./FootBar";

const Equipo = ({setPage}) => {

    return (
        <div className="slide" style={{backgroundImage:'url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.techhive.com%2Fimages%2Farticle%2F2014%2F04%2Fbusiness-meeting-150378057-100264708-large.jpg&f=1&nofb=1&ipt=4bb8ec66d671209c1839cdc94944ddbf5c9b9d0ac5722e46293da8acf666e22b&ipo=images)'}}>
            <div className="center">
                <h2 style={{fontFamily:'roboto', marginTop:'50px'}}>Equipo</h2>
                <i className="flaticon-star"></i>
                <div className="grid-container-square">
                    <div className="text">
                        <h3>Jonathan Valiente
                            <h6>Scrum Master y Desarrollador</h6>
                        </h3>
                    </div>
                    <div className="text">
                        <h3>Jose Perez  
                            <h6>Diseñador y Desarrollador</h6>
                        </h3>
                    </div>
                    <div className="text">
                        <h3>Denilson de León
                            <h6>Diseñador y Desarrollador</h6>
                        </h3>                        
                    </div>
                    <div className="text">
                        <h3>Herberth Avila
                            <h6>Diseñador y Desarrollador</h6>
                        </h3>
                    </div>
                        
                </div>
                <FootBar num={4} setPage={setPage}/>
            </div>
        </div>

    );

}

export default Equipo;

