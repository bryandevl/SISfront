import React from "react";
import { useForm } from "react-hook-form";

// Componente Input
function Input({ type = "text", placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...props}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

// Componente Button
function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}

// Componente Select
function Select({ options, placeholder, ...props }) {
  return (
    <select
      {...props}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Componente Card
function Card({ children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`border rounded shadow p-4 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

function CardTitle({ children }) {
  return <h1 className="text-2xl font-bold text-center">{children}</h1>;
}

// Componente DetalleUsuario
export default function DetalleUsuario() {
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Detalle Usuario</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Login</label>
              <Input placeholder="Usuario" {...register("login")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Apellido Paterno</label>
              <Input placeholder="Apellido paterno" {...register("paterno")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Apellido Materno</label>
              <Input placeholder="Apellido materno" {...register("materno")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <Input placeholder="Nombre" {...register("nombre")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Empresa</label>
              <Select
                placeholder="Seleccionar empresa"
                options={[
                  { value: "financiera", label: "Empresa Financiera" },
                  { value: "comercial", label: "Empresa Comercial" },
                  { value: "servicios", label: "Empresa de Servicios" },
                ]}
                {...register("empresa")}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" placeholder="correo@ejemplo.com" {...register("email")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Documento de Identidad</label>
              <Input placeholder="Número de documento" {...register("documento")} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Ejecutores</label>
              <Select
                placeholder="Seleccionar ejecutor"
                options={[
                  { value: "asesor", label: "Asesor" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "gerente", label: "Gerente" },
                ]}
                {...register("ejecutor")}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Jerarquía Nivel A</label>
              <Select
                placeholder="Seleccionar nivel"
                options={[
                  { value: "nivel1", label: "Nivel 1" },
                  { value: "nivel2", label: "Nivel 2" },
                  { value: "nivel3", label: "Nivel 3" },
                ]}
                {...register("jerarquiaNivelA")}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Jerarquía Nivel B</label>
              <Select
                placeholder="Seleccionar nivel"
                options={[
                  { value: "nivel1", label: "Nivel 1" },
                  { value: "nivel2", label: "Nivel 2" },
                  { value: "nivel3", label: "Nivel 3" },
                ]}
                {...register("jerarquiaNivelB")}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Jerarquía Nivel C</label>
              <Select
                placeholder="Seleccionar nivel"
                options={[
                  { value: "nivel1", label: "Nivel 1" },
                  { value: "nivel2", label: "Nivel 2" },
                  { value: "nivel3", label: "Nivel 3" },
                ]}
                {...register("jerarquiaNivelC")}
              />
            </div>


            <div>
              <label className="block mb-1 font-medium">Jerarquía Nivel D</label>
              <Select
                placeholder="Seleccionar nivel"
                options={[
                  { value: "nivel1", label: "Nivel 1" },
                  { value: "nivel2", label: "Nivel 2" },
                  { value: "nivel3", label: "Nivel 3" },
                ]}
                {...register("jerarquiaNivelD")}
              />
            </div>
          </div>

          {/* Estado y Asignar Perfil */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Estado</label>
              <Select
                placeholder="Seleccionar estado"
                options={[
                  { value: "habilitado", label: "Habilitado" },
                  { value: "deshabilitado", label: "Deshabilitado" },
                ]}
                {...register("estado")}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">ASIGNAR PERFIL</label>
              <Select
                placeholder="Seleccionar estado"
                options={[
                  { value: "ADMINISTRACION", label: "ADMINISTRACION" },
                  { value: "CAMPO", label: "CAMPO" },
                ]}
                {...register("PERFIL")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
