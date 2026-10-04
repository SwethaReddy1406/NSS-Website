
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Alumni from "./pages/Alumni";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/activities" element={<Activities />} />

          <Route path="/alumni" element={<Alumni />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

