// src/app/core/models/empresa.models.ts

export interface EmpresaInterface {
  id: number;
  nombre: string;
  ruc: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  logo: string | null; // URL de la imagen
  plan: 'free' | 'basic' | 'premium' | null;
  max_usuarios: number | null;
  estado: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // Campos calculados o adicionales (opcionales)
  usuarios_count?: number;
  logo_url?: string;
}

// Para crear una nueva empresa (campos requeridos)
export interface EmpresaCreate {
  nombre: string;
  ruc?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  logo?: File | string | null; // Para subir archivo
  plan?: 'free' | 'basic' | 'premium' | null;
  max_usuarios?: number | null;
  estado?: boolean;
}

// Para actualizar una empresa (todos opcionales)
export interface EmpresaUpdate {
  nombre?: string;
  ruc?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  logo?: File | string | null;
  plan?: 'free' | 'basic' | 'premium' | null;
  max_usuarios?: number | null;
  estado?: boolean;
}

// Para la relación UsuarioEmpresa
export interface UsuarioEmpresa {
  id: number;
  user: number; // ID del usuario
  empresa: number; // ID de la empresa
  estado: boolean;
  created_at: string;
  es_admin_empresa: boolean;
  // Datos adicionales (cuando se hace join)
  empresa_nombre?: string;
  user_nombre?: string;
}
