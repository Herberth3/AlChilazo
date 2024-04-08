import { FootBar } from "./FootBar";

const Faq = ({setPage}) => {
    return (
        <div className="slide" style={{backgroundImage: 'url(https://images.pexels.com/photos/681847/pexels-photo-681847.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)'}}>
            <div className="center">
                <h2>FAQ</h2>
                <div className="icon-wrapper">
                    <i className="flaticon-drink-beer-jar"></i>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim optio error molestias quasi tenetur omnis sit.</p>
                <FootBar num={2} setPage={setPage}/>
            </div>
        </div>
    );  
}


export default Faq;