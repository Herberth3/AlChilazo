export const FootBar = ({num, setPage}) => {
    return(
        <div>
            {num != 1 ? 
                <button href="" className="button" onClick={() => setPage(1)}>
                    ¿Quiénes Somos?
                </button>
            : null}
            {num != 2 ? 
                <button href="" className="button" onClick={() => setPage(2)}>
                    Faq
                </button>
            : null}
            {num != 3 ? 
                <button href="" className="button" onClick={() => setPage(3)}>
                    Términos
                </button>
            : null}
            {num != 4 ? 
                <button href="" className="button" onClick={() => setPage(4)}>
                    Equipo
                </button>
            : null}
        </div>
    );
}