import {} from '@material-ui/core';
import {BrowserRouter,Route} from 'react-router-dom';
import Mainscreen from './components/Mainscreen'
import Home from './components/Home';
function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home}/>
      <Route path="/chat" exact component={Mainscreen}/>
    </BrowserRouter>
  );
}

export default App;
