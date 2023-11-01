import './App.css';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Userdashboard from './screens/userpanel/Userdashboard';
import Team from './screens/userpanel/Team';
import Addteam from './screens/Addteam';
import Timeview from './screens/userpanel/Timeview';
import Timeschemahistory from './screens/Timeschemahistory';
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
            <Route exact path='/Addteam' element={<Addteam/>} />
            <Route exact path='/userpanel/Timeview' element={<Timeview/>} />
            <Route exact path='/Timeschemahistory' element={<Timeschemahistory/>} />
          </Routes>
        </div>
      </Router>
    // {/* </InvoiceProvider> */}
  );
}

export default App;
