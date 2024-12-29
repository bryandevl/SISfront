import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente para mostrar el Modal
const ModalVincular = ({ showModal, setShowModal, vecino, vincularFamiliar }) => {
  const [relacion, setRelacion] = useState(''); // Estado para la relación seleccionada

  const handleVincular = () => {
    if (!relacion) {
      alert('Por favor, selecciona una relación');
      return;
    }

    vincularFamiliar(vecino.id, relacion);
    setShowModal(false); // Cierra el modal después de vincular
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <h3 className="text-xl font-bold mb-4">Vincular Familiar</h3>
          <select
            className="border p-2 rounded-lg w-full mb-4"
            value={relacion}
            onChange={(e) => setRelacion(e.target.value)}
          >
            <option value="">Selecciona una relación</option>
            <option value="padre">Padre</option>
            <option value="madre">Madre</option>
            <option value="hermano">Hermano</option>
            <option value="otro">Otro</option>
          </select>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleVincular}
            >
              Vincular
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

// Componente ColumnaPersonas
const ColumnaPersonas = ({ title, people, onSelectVecino }) => {
  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {people.length > 0 ? (
          people.map((person, index) => (
            <div
              key={index}
              className="flex items-center p-4 border rounded-lg shadow-sm cursor-pointer"
              onClick={() => onSelectVecino(person)}
            >
              <img
                src={person.avatarUrl || '/imagenes/avatar.jpg'}
                alt={person.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{person.name}</span>
                <span className="text-sm text-gray-600">{person.relation}</span>
                {person.additionalInfo && (
                  <span className="text-xs text-gray-500">{person.additionalInfo}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hay personas disponibles</p>
        )}
      </div>
    </div>
  );
};

// Componente principal
export default function ColumnasPersonasDinamicas() {
  const [familiares, setFamiliares] = useState([]);
  const [vecinos, setVecinos] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedVecino, setSelectedVecino] = useState(null); // Vecino seleccionado

  useEffect(() => {
    const idFamiliar = localStorage.getItem('idUsuario');
    if (idFamiliar) {
      axios
        .post('http://localhost:5000/usuarios/vinculos', { id_familiar: idFamiliar })
        .then((response) => {
          const familiaresData = response.data.map((familiar) => ({
            name: familiar.nombre,
            relation: familiar.tipo_relacion,
            avatarUrl: '/imagenes/avatar.jpg',
            additionalInfo: '',
          }));
          setFamiliares(familiaresData);
        })
        .catch((error) => {
          console.error('Error al obtener los familiares vinculados:', error);
        });
    }

    axios
      .post('http://localhost:5000/usuarios/obtener-usuarios', { id_familiar: idFamiliar })
      .then((response) => {
        const usuariosData = response.data;
        const loggedUserId = localStorage.getItem('idUsuario');

        const filteredVecinos = usuariosData
          .filter((user) => user.id !== parseInt(loggedUserId))
          .filter((user) => !familiares.some((familiar) => familiar.name === user.nombre))
          .filter((user) => user.rol !== 'admin')
          .map((user) => ({
            name: user.nombre,
            relation: user.rol,
            avatarUrl: '/imagenes/avatar.jpg',
            additionalInfo: user.telefono,
            id: user.id, // Agregar el ID para vincular
          }));

        setVecinos(filteredVecinos);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, [familiares]);

  const vincularFamiliar = (idFamiliarOrigen, tipoRelacion) => {
    const idFamiliar = localStorage.getItem('idUsuario');
    if (!idFamiliar) return;

    axios
      .post('http://localhost:5000/usuarios/vincular-familiar', {
        id_familiar_origen: idFamiliarOrigen,
        id_familiar: idFamiliar,
        tipo_relacion: tipoRelacion,
      })
      .then((response) => {
        console.log(response.data.message); // Mensaje en consola
      })
      .catch((error) => {
        console.error('Error al vincular familiar:', error);
      });
  };

  const handleSelectVecino = (vecino) => {
    setSelectedVecino(vecino);
    setShowModal(true); // Mostrar el modal cuando se selecciona un vecino
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <ColumnaPersonas title="Familiares Vinculados" people={familiares} />
      <ColumnaPersonas title="Vecinos" people={vecinos} onSelectVecino={handleSelectVecino} />
      
      {/* Modal para vincular */}
      <ModalVincular
        showModal={showModal}
        setShowModal={setShowModal}
        vecino={selectedVecino}
        vincularFamiliar={vincularFamiliar}
      />
    </div>
  );
}
