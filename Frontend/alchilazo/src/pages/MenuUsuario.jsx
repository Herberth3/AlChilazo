import { useHistory } from "react-router-dom";

const MenuUsuario = () => {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem('correoUser');
    localStorage.removeItem('nombreUser');
    
  };

  return (
    <div>
      <h1>Bienvenido al menú de usuario {localStorage.getItem("nombreUser")}</h1>
      <button onClick={() => handleLogout()}>Cerrar sesión</button>
    </div>

  );
}

export default MenuUsuario;