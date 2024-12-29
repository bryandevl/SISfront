import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DetalleUsuario from './DetalleUsuario';

const MantUsuario = () => {
  const [users, setUsers] = useState([]); // Usuarios
  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado
  const [searchName, setSearchName] = useState(''); // Filtro de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [openModal, setOpenModal] = useState(false); // Estado del modal
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Control de visibilidad de contraseñas

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('http://localhost:5000/usuarios/obtener-usuarios');
        setUsers(response.data); // Guarda usuarios en el estado
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Alternar estado de visibilidad
    }));
  };

  // Filtrar usuarios por nombre
  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchName.toLowerCase())
  );

  // Calcular paginación
  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / 10);
  const startIndex = (currentPage - 1) * 10;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + 10);

  const handlePageChange = (event, value) => setCurrentPage(value);

  // Manejadores del modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>👤 Mantenimiento de Usuarios</h1>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" style={{ backgroundColor: '#000', color: '#fff', fontWeight: 'bold', textTransform: 'none' }}>
            Excel
          </Button>
          <Button variant="contained" style={{ backgroundColor: '#000', color: '#fff', fontWeight: 'bold', textTransform: 'none' }}>
            Imprimir
          </Button>
        </Stack>
      </div>

      <Stack direction="row" spacing={2} style={{ marginBottom: '20px' }}>
        <Button variant="contained" style={{ backgroundColor: '#000', color: '#fff', fontWeight: 'bold', textTransform: 'none' }} onClick={handleOpenModal}>
          Agregar
        </Button>
        <Button variant="contained" style={{ backgroundColor: '#d1d1d1', color: '#000', fontWeight: 'bold', textTransform: 'none' }} disabled={!selectedUser}>
          Modificar
        </Button>
        <Button variant="contained" style={{ backgroundColor: '#d1d1d1', color: '#000', fontWeight: 'bold', textTransform: 'none' }} disabled={!selectedUser}>
          Consultar
        </Button>
        <Button variant="contained" style={{ backgroundColor: '#ff4d4d', color: '#fff', fontWeight: 'bold', textTransform: 'none' }} disabled={!selectedUser}>
          Eliminar
        </Button>
      </Stack>

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Buscar por Nombre:"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
        />
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Documento</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Contraseña</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                hover
                onClick={() => setSelectedUser(user)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedUser?.id === user.id ? '#f0f0f0' : 'inherit',
                }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.documento}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>
                  {visiblePasswords[user.id] ? user.contraseña : '******'}
                  <IconButton onClick={() => togglePasswordVisibility(user.id)}>
                    {visiblePasswords[user.id] ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      color: user.estado === 'activo' ? 'green' : 'white',
                      backgroundColor: user.estado === 'activo' ? '#d4edda' : '#ff4d4d',
                    }}
                  >
                    {user.estado}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Detalle Usuario</DialogTitle>
        <DialogContent>
          <DetalleUsuario />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MantUsuario;
