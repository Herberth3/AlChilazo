import logo from '../logo.svg';
import { useState } from 'react';
import Faq from '../components/LandingPage/Faq';
import Terms from '../components/LandingPage/Terms';
import WhoWeAre from '../components/LandingPage/WhoWeAre';
import Equipo from '../components/LandingPage/Equipo';
import NavBar from '../components/LandingPage/NavBar';

const LandingPage = () => { 
    const [page, setPage] = useState(1);
    
    const printPage = () => {
        switch(page){
            case 1:                
                return <WhoWeAre setPage={setPage}/>
                break;
            case 2:
                return <Faq setPage={setPage}/>
                break;
            case 3:
                return <Terms setPage={setPage}/>
                break;      
            case 4:
                return <Equipo setPage={setPage}/>
                break;   
            default:
                return <WhoWeAre setPage={setPage}/>
                break;             
        }
    }

    return (
        <>
            <NavBar/>
            <section className="emotion">
                <div className="slider">
                    <div className="slide">
                        {printPage()}
                    </div>
                    
                </div>
                
            </section>
        </>    
    );
}

export default LandingPage;