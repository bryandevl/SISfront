import React, { useState, useEffect } from 'react';
import MantUsuario from './MantUsuario'; // Importa el componente MantUsuario
import ColumnasPersonasDinamicas from './vincularfamilia' // Asegúrate de importar el componente correspondiente
import ChatInterface from './chatuser'
import Post from './publicaciones';
import	Mapa from './maps'

// Función para generar clases del menú
const getNavClasses = () =>
  `bg-primary text-primary-foreground p-4 w-full flex justify-between items-center`;

const getLinkClasses = (isActive) =>
  `py-2 ${isActive ? 'text-secondary' : 'text-primary-foreground'} hover:text-secondary px-4 cursor-pointer`;

const menuConfig = [
  {
    title: 'Mantenimientos',
    icon: '🛠️',  // Ícono para Mantenimientos
    subMenu: [
      { title: 'Usuario', content: 'MantUsuario' }, // Asociar contenido
    ],
  },
  {
    title: 'Chat Interno',
    icon: '💬',  // Ícono para Chat Interno
    subMenu: [
      { title: 'Chat Vecinal', content: 'chatuser' },
      
    ],
  },
  {
    title: 'Vecinos',
    icon: '👨‍👩‍👧‍👦',  // Ícono para Vecinos o Familiares
    subMenu: [ { title: 'Familiares o Vecinos', content: 'ColumnasPersonasDinamicas' },],
  },
  {
    title: 'GPS',
    icon: '📍',  // Ícono para GPS
    subMenu: [{ title: 'Geolocalizacion', content: 'maps' },],
  },
  {
    title: 'Alertas o Denuncias',
    icon: '🚨',  // Ícono para Alertas o Denuncias
    subMenu: [ { title: 'Postear', content: 'publicaciones' },],
  },
];

const AdminPanel = () => {
  const [openSubMenus, setOpenSubMenus] = useState({}); // Estado dinámico para submenús abiertos
  const [selectedContent, setSelectedContent] = useState(null); // Estado para el contenido principal
  const [nombreUsuario, setNombreUsuario] = useState(''); // Estado para el nombre del usuario

  // Obtener los datos del usuario del localStorage
  useEffect(() => {
    const nombre = localStorage.getItem('nombreUsuario');
    if (nombre) {
      setNombreUsuario(nombre); // Establecer el nombre del usuario en el estado
    }
  }, []);

  // Alterna el estado de los submenús cuando se hace clic
  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title], // Alterna entre abrir o cerrar el submenú
    }));
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('correoUsuario');
    window.location.href = '/login'; // Redirige a la página de login
  };

  // Renderiza el contenido principal dinámicamente
  const renderContent = () => {
    if (selectedContent === 'MantUsuario') {
      return <MantUsuario />; // Renderiza el componente MantUsuario
    }
    if (selectedContent === 'ColumnasPersonasDinamicas') {
      return <ColumnasPersonasDinamicas />; // Renderiza el componente ColumnasPersonasDinamicas
    }

    if (selectedContent === 'chatuser') {
      return <ChatInterface/>; // Renderiza el componente ColumnasPersonasDinamicas
    }

    if (selectedContent === 'publicaciones') {
      return <Post/>; // Renderiza el componente ColumnasPersonasDinamicas Mapa
    }

    if (selectedContent === 'maps') {
      return <Mapa/>; // Renderiza el componente ColumnasPersonasDinamicas Mapa
    }



    return (
      <div>
        <h1 className="text-2xl font-bold">Welcome to the Admin Panel</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegación superior */}
      <nav className={getNavClasses()}>
        {/* Menú a la izquierda */}
        <div className="flex space-x-6">
          {menuConfig.map((menu) => (
            <div key={menu.title} className="relative">
              <button
                className={getLinkClasses(false)}
                onClick={() => toggleSubMenu(menu.title)} // Alterna la visibilidad del submenú al hacer clic
              >
                <span>
                  {menu.icon} {menu.title}
                </span>
              </button>

              {/* Submenú */}
              {menu.subMenu.length > 0 && openSubMenus[menu.title] && (
                <div
                  className="absolute left-0 mt-2 bg-primary text-primary-foreground shadow-lg rounded-lg p-4 w-48"
                >
                  <ul>
                    {menu.subMenu.map((subItem) => (
                      <li key={subItem.title} className="py-2">
                        <button
                          onClick={() => {
                            setSelectedContent(subItem.content); // Establece el contenido seleccionado
                            setOpenSubMenus((prev) => ({
                              ...prev,
                              [menu.title]: false, // Cierra el submenú después de seleccionar
                            }));
                          }}
                          className="w-full text-primary-foreground text-left hover:bg-secondary hover:text-white"
                        >
                          {subItem.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nombre de usuario y cerrar sesión */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Mostrar nombreUsuario si existe */}
          {nombreUsuario ? (
            <span className="text-primary-foreground">{nombreUsuario}</span>
          ) : (
            <span className="text-primary-foreground">Cargando...</span>
          )}
          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-background">{renderContent()}</main>
    </div>
  );
};

export default AdminPanel;
