  import { BrowserRouter, Route, Routes } from 'react-router-dom';
  import './App.css';
import { Home } from './components/home';
import { Navbar } from './components/navbar';

  function App() {
    return (
      <div>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  export default App;
