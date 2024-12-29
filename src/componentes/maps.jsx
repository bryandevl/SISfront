"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import apiClient from "../services/axios";
import { AiOutlineWarning } from "react-icons/ai";
import { FiFlag } from "react-icons/fi";

const GOOGLE_MAPS_API_KEY = "AIzaSyDOdR4ZzerWHFWIOozS7CPae7qCuVqfXhw";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapaConTabla = () => {
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [userLocation, setUserLocation] = useState(null);
  const [familiares, setFamiliares] = useState([]);
  const [selectedFamiliarId, setSelectedFamiliarId] = useState(null);
  const [selectedFamiliarLocation, setSelectedFamiliarLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [alertMarkers, setAlertMarkers] = useState([]);
  const [denunciaMarkers, setDenunciaMarkers] = useState([]);

  // Obtener ubicación del usuario actual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoaded(true);
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error.message);
          setError(error.message);
        }
      );
    } else {
      setError("La geolocalización no está soportada en este navegador.");
    }
  }, []);

  // Cargar familiares vinculados
  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");
    if (idUsuario) {
      apiClient
        .post("/usuarios/vinculos", { id_familiar: idUsuario })
        .then((response) => {
          setFamiliares(
            response.data.map((familiar) => ({
              id: familiar.id,
              name: familiar.nombre || "Desconocido",
              relation: familiar.tipo_relacion || "Sin relación",
              avatarUrl: "/imagenes/avatar.jpg",
            }))
          );
        })
        .catch((error) =>
          console.error("Error al obtener familiares:", error)
        );
    }
  }, []);

  // Manejar selección de un familiar
  const handleSelectFamiliar = async (familiarId) => {
    setSelectedFamiliarId(familiarId);
    console.log("Familiar seleccionado ID:", familiarId);

    try {
      const response = await apiClient.get(`/ubicaciones/${familiarId}`);
      const [location] = response.data;

      if (location) {
        setSelectedFamiliarLocation({
          lat: parseFloat(location.latitud),
          lng: parseFloat(location.longitud),
        });
        setCenter({
          lat: parseFloat(location.latitud),
          lng: parseFloat(location.longitud),
        });
      } else {
        console.warn("No se encontró la ubicación del familiar seleccionado.");
      }
    } catch (error) {
      console.error("Error al obtener la ubicación del familiar:", error);
    }
  };

  // Manejar selección de "alertas" y "denuncias"
  const fetchMarkers = async (alertType) => {
    try {
      const response = await apiClient.get(`/posts?alertType=${alertType}`);
      const markers = response.data.map((post) => ({
        lat: parseFloat(post.latitude),
        lng: parseFloat(post.longitude),
      }));

      if (alertType === "alerta") {
        setAlertMarkers(markers);
      } else if (alertType === "denuncia") {
        setDenunciaMarkers(markers);
      }
    } catch (error) {
      console.error(`Error al cargar ${alertType}s:`, error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen items-start p-6">
      {/* Tabla en el lado izquierdo */}
      <div className="lg:w-1/3 w-full lg:pr-6 mb-6 lg:mb-0">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Familiares Vinculados
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          {familiares.length > 0 ? (
            <ul>
              {familiares.map((familiar) => (
                <li
                  key={familiar.id}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 ${
                    selectedFamiliarId === familiar.id
                      ? "bg-blue-100"
                      : "bg-white"
                  }`}
                  onClick={() => handleSelectFamiliar(familiar.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={familiar.avatarUrl}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-bold">{familiar.name}</p>
                      <p className="text-sm text-gray-500">
                        {familiar.relation}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500 text-center">
              No hay familiares vinculados.
            </p>
          )}
        </div>
      </div>

      {/* Mapa en el lado derecho */}
      <div className="lg:w-2/3 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Mapa Interactivo</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 flex justify-center gap-4">
            {/* Botones de alerta y denuncia */}
            <button
              onClick={() => fetchMarkers("alerta")}
              className="flex items-center text-yellow-500 hover:text-yellow-600"
            >
              <AiOutlineWarning className="mr-2" size={24} /> Ver Alertas
            </button>
            <button
              onClick={() => fetchMarkers("denuncia")}
              className="flex items-center text-purple-500 hover:text-purple-600"
            >
              <FiFlag className="mr-2" size={24} /> Ver Denuncias
            </button>
          </div>
          {loadError ? (
            <div className="p-4 text-red-500">
              <p>Error al cargar el mapa: {loadError}</p>
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey={GOOGLE_MAPS_API_KEY}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                setLoadError("Hubo un error al cargar la API de Google Maps.");
                console.error("Error de carga:", e);
              }}
            >
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                >
                  {/* Marcador de ubicación del usuario actual */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: { width: 40, height: 40 },
                      }}
                    />
                  )}

                  {/* Marcadores de alertas */}
                  {alertMarkers.map((marker, index) => (
                    <Marker
                      key={`alert-${index}`}
                      position={marker}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                        scaledSize: { width: 40, height: 40 },
                      }}
                    />
                  ))}

                  {/* Marcadores de denuncias */}
                  {denunciaMarkers.map((marker, index) => (
                    <Marker
                      key={`denuncia-${index}`}
                      position={marker}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                        scaledSize: { width: 40, height: 40 },
                      }}
                    />
                  ))}

                  {/* Marcador de ubicación del familiar seleccionado */}
                  {selectedFamiliarLocation && (
                    <Marker
                      position={selectedFamiliarLocation}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: { width: 40, height: 40 },
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </LoadScript>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapaConTabla;
