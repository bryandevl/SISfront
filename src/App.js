import './App.css';
import AdminPanel from './componentes/MenuItem.jsx'; // Verifica la ruta
import LoginPage from './componentes/LoginPage.jsx';
import MantUsuario from './componentes/MantUsuario.jsx'
import DetalleUsuario from './componentes/DetalleUsuario.jsx'
import Registro from './componentes/RegisterUser.jsx'
import ColumnasPersonasDinamicas from './componentes/vincularfamilia.jsx'
import ChatInterface from './componentes/chatuser.jsx'
import Post from './componentes/publicaciones.jsx'
import Mapa from './componentes/maps.jsx'


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './componentes/ProtectedRoute.jsx'; // Importa la ruta protegida

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirigir de la raíz (/) a la página de login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta del login */}
          <Route path="/login" element={<LoginPage />} />

           {/* Ruta del login */}
           <Route path="/MantUser" element={<MantUsuario />} />

           {/* Ruta del login */}
           <Route path="/DetalleUsuario" element={<DetalleUsuario />} />
          
            {/* Ruta del login */}
            <Route path="/signup" element={<Registro />} />

             {/* Ruta del  ChatInterface login */}
             <Route path="/familiar" element={<ColumnasPersonasDinamicas />} />

            {/* Ruta del  Post login */}
            <Route path="/chat" element={<ChatInterface/>} />

            {/* Ruta del  Mapa login */}
            <Route path="/postear" element={<Post/>} />

              {/* Ruta del  Mapa login */}
              <Route path="/Maps" element={<Mapa/>} />

          {/* Ruta protegida del panel de administración */}
          <Route 
            path="/Menus" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
