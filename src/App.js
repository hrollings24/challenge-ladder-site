import LogoImage from './components/logo'
import Signup from './components/SignedOut/SignUp';
import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from './components/Home/Home.js';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import ViewLadder from './components/Ladder/ViewLadder';
import NotificationPage from './components/NotificationPage/NotificationPage';
import ChallengeView from './components/Challenge/ChallengeView';
import Account from './components/Account/Account';
import FindLadder from './components/Find/findladder';
import CreateLadder from './components/Create/CreateLadder';
import HomeAway from './components/SignedOut/HomeAway';


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
              <Route path="/:ladderurl" component={ViewLadder} />
            </Switch>
          </AuthProvider>
        </Router>
        </div>
    </AuthProvider>
  
  );
}

export default App;
