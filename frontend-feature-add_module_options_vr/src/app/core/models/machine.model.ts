export interface Machine {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  nfcTagId: string;
  nfcCode: string;
  clientName: string;
  clientId: string;
  clientAddress: string;
  clientPhone: string;
  clientRut: string;
  status: 'OPERATIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'PENDING_INSTALL' | 'INACTIVE';
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MachineResponse {
  data: Machine[];
  total: number;
  page: number;
  pageSize: number;
}
