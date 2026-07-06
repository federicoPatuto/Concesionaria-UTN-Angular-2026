export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  tipo: 'cliente' | 'admin';
}

export interface Cliente extends Usuario {
  tipo: 'cliente';
  favoritos: number[];
}

export interface Admin extends Usuario {
  tipo: 'admin';
  idConcesionaria: number;
}