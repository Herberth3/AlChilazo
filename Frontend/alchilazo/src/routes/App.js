import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LandingPage from '../pages/LadingPage';
import { DeliveryRequest } from '../pages/DeliveryRequest';
import { CompanyRequest } from '../pages/CompanyRequest';
import FormularioRegistroRepartidor from '../pages/FormularioRegistroRepartidor';
import RegistroUsuario from '../pages/RegistroUsuario';
import LoginAdmin from '../pages/Empresa/LoginAdmin';
import LoginUsuario from '../pages/LoginUsuario';
import LoginEmpresa from '../pages/Empresa/LoginEmpresa';
import RegistroEmpresa from '../pages/Empresa/RegistroEmpresa';
import MenuEmpresa from '../pages/Empresa/menu/MenuEmpresa';
import CatalogoProductos from '../pages/Empresa/menu/CatalogoProductos';
import ProductAdd from '../pages/Empresa/menu/ProductAdd';
import { Reports } from '../pages/Reports';
import MenuUsuario from '../pages/Usuario/MenuUsuario';
import DeliveryHome from '../pages/DeliveryHome';
import DeliveryProfile from '../pages/DeliveryProfile';
import DeliveryLogin from '../pages/DeliveryLogin';
import DeliveryRating from '../pages/DeliveryRating';
import ProductModify from '../pages/Empresa/menu/ProductModify';
import NavegacionCategoria from '../pages/Usuario/NavegacionCategoria';
import DeliveryComissions from '../pages/DeliveryComissions';
import { DisableUsers } from '../pages/Admin/DisableUsers';
import PedirProducto from '../pages/PedirProducto';
import CarritoCompraUsuario from '../pages/CarritoCompraUsuario';
import PedidosEmpresa from '../pages/Empresa/menu/PedidosEmpresa';
import DeliveryOrders from '../pages/DeliveryOrders';
import DeliveryCompleted from '../pages/DeliveryCompleted';
import DeliveryHistory from '../pages/DeliveryHistory';

import ReportesEmpresa from '../pages/Empresa/reportes/ReportesEmpresa';
import EstadoPedidos from '../pages/Usuario/EstadoPedidos';
import HistorialUsuario from '../pages/Usuario/HistorialUsuario';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/admin/delivery-drivers" component={DeliveryRequest} />
        <Route path="/admin/companies" component={CompanyRequest} />
        <Route path="/formdv" component={FormularioRegistroRepartidor}/>
        <Route path="/delivery/home" component={DeliveryHome}/>
        <Route path="/delivery/profile" component={DeliveryProfile}/>
        <Route path="/delivery/orders" component={DeliveryOrders}/>
        <Route path="/delivery/completed" component={DeliveryCompleted}/>
        <Route path="/delivery/history" component={DeliveryHistory}/>
        <Route path="/delivery/login" component={DeliveryLogin}/>
        <Route path="/delivery/comissions" component={DeliveryComissions}/>
        <Route path="/delivery/ratings" component={DeliveryRating}/>
        <Route path='/registroUsuario' component={RegistroUsuario}/>
        <Route path='/loginUsuario' component={LoginUsuario} />
        <Route path='/loginAdmin' component={LoginAdmin} />
        <Route path="/empresa/catalogo" component={CatalogoProductos}/>
        <Route path='/empresa/pedidos' component={PedidosEmpresa}/>
        <Route path="/empresa/panelAdd" component={ProductAdd}/>
        <Route path="/empresa/panelModify/:idProducto/:esCombo" component={ProductModify}/>
        <Route path="/empresa/login" component={LoginEmpresa}/>
        <Route path="/empresa/registro" component={RegistroEmpresa}/>
        <Route path="/empresa/menu" component={MenuEmpresa}/>
        <Route path="/empresa/reportes" component={ReportesEmpresa}/>
        <Route path='/admin/reports' component={Reports} />        
        <Route path='/menuUsuario' component={MenuUsuario} />
        <Route path='/navegacionCategoria' component={NavegacionCategoria} />
        <Route path="/admin/users" component={DisableUsers} />
        <Route path='/pedirProducto/:id/:esCombo' component={PedirProducto} />
        <Route path='/carrito' component={CarritoCompraUsuario} />
        <Route path='/estadoPedidos' component={EstadoPedidos} />
        <Route path='/historialPedidos' component={HistorialUsuario} />
        <Route path="*" component={LandingPage}/>
      </Switch>
    </Router>
  );
}

export default App;