'use client';

import React, { useState, useEffect } from 'react';
import socket from '../services/socket'; // Configuración del cliente WebSocket
import apiClient from '../services/axios'; // Configuración del cliente Axios
import { AiOutlineWarning } from 'react-icons/ai';
import { FiFlag } from 'react-icons/fi';

function Post() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error.message);
        }
      );
    } else {
      console.error('La geolocalización no está soportada por este navegador.');
    }
  }, []);

  // Función para cargar publicaciones
  const fetchPosts = () => {
    apiClient
      .get('/posts')
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Error al cargar publicaciones:', error));
  };

  // Cargar publicaciones iniciales y configurar intervalo
  useEffect(() => {
    fetchPosts(); // Cargar publicaciones al montar el componente

    // Configurar intervalo para actualizar cada segundo
    const intervalId = setInterval(() => {
      fetchPosts();
    }, 1000); // Actualizar cada 1000 ms

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  // Configurar suscripciones WebSocket
  useEffect(() => {
    const handleNewPost = (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const handleNewComment = ({ postId, comment }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    };

    const handlePostLiked = ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes } : post
        )
      );
    };

    socket.on('new_post', handleNewPost);
    socket.on('new_comment', handleNewComment);
    socket.on('post_liked', handlePostLiked);

    return () => {
      socket.off('new_post', handleNewPost);
      socket.off('new_comment', handleNewComment);
      socket.off('post_liked', handlePostLiked);
    };
  }, []);

  // Crear una nueva publicación
  const addPost = (e) => {
    e.preventDefault();
    const author = localStorage.getItem('nombreUsuario') || 'Usuario Anónimo';

    if (newPostContent.trim() && selectedAlert && location.latitude && location.longitude) {
      const post = {
        content: newPostContent,
        author,
        alertType: selectedAlert,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      apiClient
        .post('/posts/create', post)
        .then(() => {
          setNewPostContent('');
          setSelectedAlert(null);
        })
        .catch((error) =>
          console.error('Error al crear publicación:', error.response?.data)
        );
    } else {
      console.error('Falta completar la ubicación o el contenido.');
    }
  };

  // Dar "like" a una publicación
  const likePost = (postId) => {
    apiClient
      .patch(`/posts/${postId}/like`)
      .catch((error) =>
        console.error('Error al dar like:', error.response?.data)
      );
  };

  // Agregar comentario a una publicación
  const addComment = (postId, content) => {
    const author = localStorage.getItem('nombreUsuario') || 'Usuario Anónimo';

    if (content.trim()) {
      apiClient
        .post(`/posts/${postId}/comments`, { content, author, postId })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Error desconocido';
          console.error('Error al agregar comentario:', errorMessage);
          alert(`Error: ${errorMessage}`);
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">DENUNCIAS / ALERTAS</h1>

      {/* Formulario para crear nueva publicación */}
      <form onSubmit={addPost} className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            className={`flex items-center text-xl ${
              selectedAlert === 'alerta'
                ? 'text-yellow-500'
                : 'text-gray-500'
            } hover:text-yellow-600`}
            onClick={() => setSelectedAlert('alerta')}
          >
            <AiOutlineWarning className="mr-2" />
            Alerta
          </button>
          <button
            type="button"
            className={`flex items-center text-xl ${
              selectedAlert === 'denuncia'
                ? 'text-blue-500'
                : 'text-gray-500'
            } hover:text-blue-600`}
            onClick={() => setSelectedAlert('denuncia')}
          >
            <FiFlag className="mr-2" />
            Denunciar
          </button>
        </div>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Publicar
        </button>
      </form>

      {/* Lista de publicaciones */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-white border border-gray-300 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl">
                {post.author[0]}
              </div>
              <div className="ml-4">
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p>{post.content}</p>
              {post.alertType && (
                <div className="mt-2 text-sm text-gray-600">
                  {post.alertType === 'alerta' ? (
                    <span className="flex items-center text-yellow-500">
                      <AiOutlineWarning className="mr-2" /> Alerta
                    </span>
                  ) : (
                    <span className="flex items-center text-blue-500">
                      <FiFlag className="mr-2" /> Denuncia
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-6">
                <button
                  className="flex items-center text-xl text-red-500 hover:text-red-600"
                  onClick={() => likePost(post.id)}
                >
                  ❤️ {post.likes}
                </button>
                <button className="flex items-center text-xl text-gray-500 hover:text-gray-600">
                  💬 {post.comments?.length || 0}
                </button>
              </div>
              <div className="space-y-4">
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border-t border-gray-200"
                  >
                    <p className="font-semibold">{comment.author}:</p>
                    <p>{comment.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
                <CommentForm postId={post.id} onComment={addComment} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentForm({ postId, onComment }) {
  const [newComment, setNewComment] = useState('');

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(postId, newComment);
      setNewComment('');
    }
  };

  return (
    <form onSubmit={handleComment} className="flex items-center mt-4">
      <input
        type="text"
        placeholder="Añade un comentario..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Comentar
      </button>
    </form>
  );
}

export default Post;
