'use client';

import { useState, useEffect, useRef } from 'react';
import socket from '../services/socket';
import apiClient from '../services/axios';

const Input = ({ value, onChange, onKeyPress, placeholder }) => (
  <input
    type="text"
    className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
  />
);

const Button = ({ children, onClick }) => (
  <button className="p-2 bg-blue-500 text-white rounded-lg" onClick={onClick}>
    {children}
  </button>
);

const ScrollArea = ({ children }) => (
  <div className="overflow-y-auto h-full">{children}</div>
);

const Avatar = ({ src, alt, children }) => (
  <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-300">
    {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : children}
  </div>
);

const AvatarFallback = ({ children }) => (
  <div className="text-white text-lg font-semibold">{children}</div>
);

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cargar familiares vinculados
  useEffect(() => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
      apiClient
        .post('/usuarios/vinculos', { id_familiar: idUsuario })
        .then((response) => {
          setFamiliares(
            response.data.map((familiar) => ({
              id: familiar.id,
              name: familiar.nombre || 'Desconocido',
              relation: familiar.tipo_relacion || 'Sin relación',
              avatarUrl: '/imagenes/avatar.jpg',
            }))
          );
        })
        .catch((error) => console.error('Error al obtener familiares:', error));
    }
  }, []);

  // Cargar conversaciones existentes
  useEffect(() => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
      apiClient
        .post('/conversaciones/usuario', { idUsuario })
        .then((response) => setChats(response.data || []))
        .catch((error) => console.error('Error al obtener conversaciones:', error));
    }
  }, []);

  const handleSelectChat = (familiar) => {
    const idUsuario = localStorage.getItem('idUsuario');
    const existingChat = chats.find(
      (chat) =>
        (chat.usuario_1?.id === Number(idUsuario) && chat.usuario_2?.id === familiar.id) ||
        (chat.usuario_2?.id === Number(idUsuario) && chat.usuario_1?.id === familiar.id)
    );

    if (existingChat) {
      setSelectedChat({
        ...existingChat,
        name: familiar.name, // Asignar el nombre del usuario seleccionado
        avatarUrl: familiar.avatarUrl,
      });
      fetchMessages(existingChat.id);
    } else {
      apiClient
        .post('/conversaciones/crearConversacion', {
          usuario_1: Number(idUsuario),
          usuario_2: familiar.id,
        })
        .then((response) => {
          const nuevaConversacion = {
            ...response.data,
            name: familiar.name, // Asignar el nombre del usuario seleccionado
            avatarUrl: familiar.avatarUrl,
          };
          setChats([...chats, nuevaConversacion]);
          setSelectedChat(nuevaConversacion);
          fetchMessages(nuevaConversacion.id);
        })
        .catch((error) => console.error('Error al crear conversación:', error));
    }
  };

  const fetchMessages = (conversacionId) => {
    apiClient
      .get(`/mensajes/conversacion/${conversacionId}`)
      .then((response) => setMessages(response.data || []))
      .catch((error) => console.error('Error al obtener mensajes:', error));
  };

  const handleSendMessage = () => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (inputMessage.trim() && selectedChat) {
      const newMessage = {
        conversacion_id: selectedChat.id,
        remitente_id: idUsuario,
        mensaje: inputMessage,
      };

      socket.emit('send_message', newMessage);
      setInputMessage('');
    }
  };

  useEffect(() => {
    if (selectedChat) {
      socket.emit('join', { conversacionId: selectedChat.id });

      socket.on('nuevo_mensaje', (mensaje) => {
        if (mensaje.conversacion_id === selectedChat.id) {
          setMessages((prevMessages) => [...prevMessages, mensaje]);
        }
      });

      return () => {
        socket.emit('leave', { conversacionId: selectedChat.id });
        socket.off('nuevo_mensaje');
      };
    }
  }, [selectedChat]);

  return (
    <div className="flex">
      <div className="w-1/3 bg-white border-r shadow-md">
        <div className="p-4 bg-gray-100">Usuarios Vinculados</div>
        <ScrollArea>
          {familiares.map((familiar) => (
            <div
              key={familiar.id}
              className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectChat(familiar)}
            >
              <Avatar src={familiar.avatarUrl} alt={familiar.name}>
                <AvatarFallback>{familiar.name ? familiar.name[0] : '?'}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <div className="font-semibold">{familiar.name}</div>
                <div className="text-sm text-gray-500">{familiar.relation}</div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-100 flex items-center shadow-md">
              <Avatar src={selectedChat.avatarUrl} alt={selectedChat.name}>
                <AvatarFallback>{selectedChat.name ? selectedChat.name[0] : '?'}</AvatarFallback>
              </Avatar>
              <div className="ml-4 font-semibold">{selectedChat.name || 'Usuario Desconocido'}</div>
            </div>
            <ScrollArea ref={scrollRef}>
              <div className="p-4">
                {messages.map((message, index) => (
                  <div key={index} className="mb-4">
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.remitente_id === Number(localStorage.getItem('idUsuario'))
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.mensaje}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 bg-gray-100 border-t">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje"
              />
              <Button onClick={handleSendMessage}>Enviar</Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-lg text-gray-500">
            Selecciona un usuario para empezar
          </div>
        )}
      </div>
    </div>
  );
}
