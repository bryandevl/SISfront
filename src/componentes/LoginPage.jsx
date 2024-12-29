import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const sharedClasses = {
  inputField: 'w-full h-[34.125px] px-2 border border-border rounded-lg focus:ring ring-primary pl-10 text-sm',
  button: 'w-full bg-gradient-to-r from-[#20232c] to-[#20232c] text-primary-foreground hover:bg-zinc-900/80 p-2 rounded-lg focus:ring ring-primary',
};

const LoginForm = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/usuarios/login', {
        correo: correo,
        contraseña: password,
      });

      const userData = response.data;

      if (response.status === 200 || response.status === 201) {
        // Guardar datos en localStorage
        localStorage.setItem('idUsuario', userData.id);
        localStorage.setItem('nombreUsuario', userData.nombre);
        localStorage.setItem('correoUsuario', userData.correo);

        // Registrar ubicación del usuario
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              try {
                await axios.post('http://localhost:5000/ubicaciones/create', {
                  id_usuario: userData.id,
                  latitud: latitude,
                  longitud: longitude,
                });
                console.log('Ubicación registrada exitosamente.');
              } catch (ubicacionError) {
                console.error('Error al registrar ubicación:', ubicacionError);
              }
            },
            (geoError) => {
              console.error('Error al obtener la ubicación del usuario:', geoError);
            }
          );
        } else {
          console.error('Geolocalización no soportada en este navegador.');
        }

        // Redirigir al siguiente módulo
        navigate('/Menus');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Hubo un problema al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="w-full sm:w-3/4 md:w-1/4 bg-white p-8 flex flex-col justify-center shadow-lg rounded-lg mx-auto">
      <h2 className="text-2xl font-semibold text-primary text-center">Bienvenido!</h2>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-center text-muted-foreground">ACCESO SEGURO</h3>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Campo Correo */}
          <label className="block mb-2 text-muted-foreground" htmlFor="correo">Correo *</label>
          <div className="relative">
            <input
              className={`${sharedClasses.inputField} text-center`}
              type="email"
              id="correo"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <img
              aria-hidden="true"
              alt="email-icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=✉️"
              className="absolute left-3 top-2.5"
            />
          </div>

          {/* Campo Contraseña */}
          <label className="block mt-4 mb-2 text-muted-foreground" htmlFor="password">Contraseña *</label>
          <div className="relative">
            <input
              className={`${sharedClasses.inputField} text-center`}
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              aria-hidden="true"
              alt="lock-icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=🔒"
              className="absolute left-3 top-2.5"
            />
          </div>

          {/* Mensaje de error */}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          {/* Botón de envío */}
          <button className={sharedClasses.button} type="submit">Iniciar sesión</button>
        </form>

        {/* Link para ir a la página de registro */}
        <div className="text-center mt-4">
          <span>No tienes cuenta? </span>
          <Link to="/signup" className="text-blue-500 hover:underline">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      <div
        className="w-full sm:w-3/4 relative flex items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/imagenes/logo.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Superposición de color degradado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>

        {/* Contenedor de contenido con sombra y opacidad */}
        <div className="relative text-center bg-black/50 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold">SEGUROS VECINALES</h1>
          <p className="mt-2 text-lg">Su seguridad es nuestro propósito</p>
        </div>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
