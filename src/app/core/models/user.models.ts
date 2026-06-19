// src/app/core/models/user.model.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  date_joined?: string;
  empresa_id?: number;
  empresa_nombre?: string;
  es_admin_empresa?: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  empresa_id?: number;
  es_admin_empresa?: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  empresa_id?: number;
  password?: string;
  es_admin_empresa?: boolean;
}
