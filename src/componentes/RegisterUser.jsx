import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";

export default function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documento: "",
    correo: "",
    contraseña: "",
    telefono: "",
  });
  const [modal, setModal] = useState({ show: false, message: "", success: false });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      nombre: formData.nombreCompleto,
      documento: formData.documento,
      correo: formData.correo,
      contraseña: formData.contraseña,
      telefono: formData.telefono,
      rol: "vecino",
      estaod: "activo",
    };

    try {
      const response = await axios.post("http://localhost:5000/usuarios/create-user", dataToSend);

      if (response.status === 200 || response.status === 201) {
        setModal({ show: true, message: "¡Registro exitoso!", success: true });
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setModal({ show: true, message: "DNI NO EXISTE. INGRESE UNO VÁLIDO", success: false });
      } else {
        setModal({ show: true, message: "Error inesperado. Intente nuevamente.", success: false });
      }
    }
  };

  const handleCloseModal = () => {
    setModal({ show: false, message: "", success: false });

    if (modal.success) {
      window.location.href = "/login"; // Redirigir al login en caso de éxito
    }
  };

  return (
    <div className="w-full sm:w-3/4 md:w-1/3 lg:w-1/4 mx-auto mt-10">
      <div className="bg-white p-6 rounded-lg border-2 border-gray-400 shadow-2xl shadow-gray-400/50">
        <h2 className="text-2xl font-semibold text-center text-primary">Registro</h2>
        <p className="text-center text-sm text-muted-foreground">Crea una nueva cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              id="nombreCompleto"
              type="text"
              placeholder="Juan Pérez"
              required
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700">
              Documento
            </label>
            <input
              id="documento"
              type="text"
              placeholder="12345678"
              required
              value={formData.documento}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              required
              value={formData.correo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              placeholder="987456321"
              required
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.contraseña}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-md"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#20232c] to-[#20232c] text-white hover:bg-zinc-900/80 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>

      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 md:w-1/3 shadow-lg">
            <h3 className={`text-lg font-bold ${modal.success ? "text-green-500" : "text-red-500"}`}>
              {modal.success ? "Éxito" : "Error"}
            </h3>
            <p className="mt-4 text-gray-700">{modal.message}</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              {modal.success ? "Ir al Login" : "Cerrar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
