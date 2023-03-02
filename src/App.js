import "./input.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SynchScreen from "./pages/SynchScreen";
import VideoStatsVert from "./pages/VideoStatsVert";
import VertStatsReport from "./pages/VertStatsReport";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
          <main className="container mx-auto px-3 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/synchscreen" element={<SynchScreen />} />
              <Route path="/videostatsvert" element={<VideoStatsVert />} />
              <Route path="/vertstatsreport" element={<VertStatsReport />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </main>
        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
