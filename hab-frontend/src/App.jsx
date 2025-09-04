import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Home from "./pages/Home";
import Hostels from "./pages/Hostels";
import AllHostelList from "./pages/AllHostelList";
import Caterers from "./pages/Caterers";
import Students from "./pages/Students";
import HostelStats from "./pages/stats/HostelStats.jsx";
import CreateMess from "./Components/CreateMess";
import MessDetails from "./Components/MessDetails";
import MessMenu from "./Components/MessMenu";
import HostelForm from "./pages/HostelForm";
import HostelPage from "./pages/HostelPage";

import MessChangePage from "./pages/MessChangePage.jsx";
import AllocateHostel from "./pages/AllocateHostel.jsx";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hostels" element={<AllHostelList />} />
            <Route path="/create-hostel" element={<HostelForm />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />
            <Route path="/caterers" element={<Caterers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/create-mess" element={<CreateMess />} />
            <Route path="/mess/:id" element={<MessDetails />} />
            <Route path="/mess/menu/:id" element={<MessMenu />} />
            <Route
              path="/mess/changeapplication"
              element={
                <>
                  <MessChangePage />
                </>
              }
            />
            <Route path="/allocate-hostel" element={<AllocateHostel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
