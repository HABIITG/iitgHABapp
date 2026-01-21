import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import Hostels from "./pages/Hostels";
import Privacy from "./pages/Privacy";
import ContactSupport from "./pages/ContactSupport";
import BugReport from "./pages/BugReport";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/bug-report" element={<BugReport />} />
        </Routes>
      </Layout>
    </Router>
  );
}
