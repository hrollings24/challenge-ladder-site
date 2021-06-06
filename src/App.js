import LogoImage from './components/logo'
import Signup from './components/SignedOut/SignUp';
import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from './components/Home/Home.js';
import Login from './components/Login';
import PrivateRoute from './Routes/PrivateRoute';
import ViewLadder from './components/Ladder/ViewLadder';
import NotificationPage from './components/NotificationPage/NotificationPage';
import ChallengeView from './components/Challenge/ChallengeView';
import Account from './components/Account/Account';
import FindLadder from './components/Find/findladder';
import CreateLadder from './components/Create/CreateLadder';
import HomeAway from './components/SignedOut/HomeAway';
import LadderSettings from './components/LadderSettings/LadderSettings';


function App() {
  return (
    <AuthProvider>
        <style>{'body { background-color:rgb(135,208,220);}'}</style>

        <div>
        <Router>
          <AuthProvider> 
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute exact path="/notifications" component={NotificationPage} />
              <PrivateRoute exact path="/account" component={Account} />
              <PrivateRoute exact path="/challenge" component={ChallengeView} />
              <PrivateRoute exact path="/findladders" component={FindLadder} />
              <PrivateRoute exact path="/create" component={CreateLadder} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/home" component={HomeAway} />
              <Route exact path="/:ladderurl" component={ViewLadder} />
              <PrivateRoute exact path="/:ladderurl/admin" component={LadderSettings} />
            </Switch>
          </AuthProvider>
        </Router>
        </div>
    </AuthProvider>
  
  );
}

export default App;
