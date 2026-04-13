export interface NFC {
  id: string;
  nombre: string;
  estado: 'activo' | 'inactivo';
}

export interface Local {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  nfc: NFC;
}
