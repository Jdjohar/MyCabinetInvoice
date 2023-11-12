import './App.css';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Userdashboard from './screens/userpanel/Userdashboard';
import Team from './screens/userpanel/Team';
import Addteam from './screens/userpanel/Addteam';
import Timeview from './screens/userpanel/Timeview';
import Timeschemahistory from './screens/Timeschemahistory';
import Teammenberdashboard from './screens/Teammemberpanel/Teammenberdashboard';
import Customerlist from './screens/userpanel/Customerlist';
import Addcustomer from './screens/userpanel/Addcustomer';
import Editcustomer from './screens/userpanel/Editcustomer';
import Itemlist from './screens/userpanel/Itemlist';
import Additem from './screens/userpanel/Additem';
import Edititem from './screens/userpanel/Edititem';
import Editteam from './screens/userpanel/Editteam';
// import { InvoiceProvider } from './components/InvoiceContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    // <InvoiceProvider>
      <Router>
        <div>
          <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/signup' element={<SignUp/>} />
            <Route exact path='/userpanel/Userdashboard' element={<Userdashboard/>} />
            <Route exact path='/userpanel/Team' element={<Team/>} />
            <Route exact path='/userpanel/Addteam' element={<Addteam/>} />
            <Route exact path='/userpanel/Editteam' element={<Editteam/>} />
            <Route exact path='/userpanel/Timeview' element={<Timeview/>} />
            <Route exact path='/userpanel/Customerlist' element={<Customerlist/>} />
            <Route exact path='/userpanel/Addcustomer' element={<Addcustomer/>} />
            <Route exact path='/userpanel/Editcustomer' element={<Editcustomer/>} />
            <Route exact path='/userpanel/Itemlist' element={<Itemlist/>} />
            <Route exact path='/userpanel/Additem' element={<Additem/>} />
            <Route exact path='/userpanel/Edititem' element={<Edititem/>} />
            <Route exact path='/Timeschemahistory' element={<Timeschemahistory/>} />
            <Route exact path='/Teammemberpanel/Teammenberdashboard' element={<Teammenberdashboard/>} />
          </Routes>
        </div>
      </Router>
    // {/* </InvoiceProvider> */}
  );
}

export default App;
