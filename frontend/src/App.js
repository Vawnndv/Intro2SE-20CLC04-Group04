import './App.css';
import './components/fontawesome/FontAwesome.js';
import Header from './components/header/Header.js';
import Homepage from './components/homepage/homepage';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductScreen from "./components/homepage/ProductScreen";
import {Container} from "react-bootstrap";

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <Header/>
          <main>
              {/* <Container className="mt-3"> */}
                  <Routes>
                      <Route path="/product/:slug" element={<ProductScreen />} />
                      <Route path="/" element={<Homepage />} />
                  </Routes>
              {/* </Container> */}
          </main>
        </div>
    </BrowserRouter>
  );
}

export default App;
