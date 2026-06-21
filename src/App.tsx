import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';
import About from './pages/About';
import Suggest from './pages/Suggest';
import Admin from './pages/Admin';
import Community from './pages/Community';
import Share from './pages/Share';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="modules/:id" element={<ModulePage />} />
        <Route path="community" element={<Community />} />
        <Route path="share" element={<Share />} />
        <Route path="suggest" element={<Suggest />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
