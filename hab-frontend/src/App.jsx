import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Hostels from "./pages/Hostels";
import Caterers from "./pages/Caterers";
import Students from "./pages/Students";
import OverallStats from "./pages/stats/OverallStats";
import HostelStats from "./pages/stats/HostelStats";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/caterers" element={<Caterers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/overallstats" element={<OverallStats />} />
            <Route path="/hostelstats" element={<HostelStats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
