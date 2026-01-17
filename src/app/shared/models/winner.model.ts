/**
 * Ganador de rifa
 */
export interface Winner {
  id: string;
  tenantId: string;
  
  // Información del ganador (AUTO-GENERADA al cerrar rifa)
  name: string;                           // Del cliente que compró el boleto
  phone: string;                          // WhatsApp del ganador
  raffleId: string;                       // ID de la rifa ganada
  raffleName: string;                     // Nombre de la rifa
  prize: string;                          // Descripción del premio
  winningNumber: number;                  // Número ganador
  drawDate: Date;                         // Fecha del sorteo
  
  // Multimedia (ADMIN sube esto)
  photoUrl?: string;                      // Foto del premio entregado
  
  // Estado
  photoUploaded: boolean;                 // ¿Ya subió foto?
  isActive: boolean;                      // Mostrar/Ocultar en web pública
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear ganador
 */
export interface CreateWinnerDto {
  name: string;
  raffleId: string;
  raffleName: string;
  prize: string;
  winningNumber: number;
  drawDate: Date;
  photoUrl?: string;
  isActive: boolean;
}

/**
 * DTO para actualizar ganador
 */
export interface UpdateWinnerDto {
  name?: string;
  prize?: string;
  winningNumber?: number;
  photoUrl?: string;
  isActive?: boolean;
}

// ==================== MOCK DATA ====================
export const MOCK_WINNERS: Winner[] = [
  {
    id: '1',
    tenantId: 'tenant-123',
    name: 'Juan Pérez',
    phone: '123456789',
    raffleId: 'raffle-1',
    raffleName: 'Rifa Premium iPhone 15',
    prize: 'iPhone 15 Pro Max 256GB',
    winningNumber: 542,
    drawDate: new Date('2025-01-15'),
    photoUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=400&fit=crop',
    photoUploaded: true,
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: '2',
    tenantId: 'tenant-123',
    name: 'María González',
    phone: '987654321',
    raffleId: 'raffle-2',
    raffleName: 'Mega Rifa Laptop',
    prize: 'MacBook Pro M3 14"',
    winningNumber: 1234,
    drawDate: new Date('2025-01-10'),
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    photoUploaded: true,
    isActive: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10')
  },
  {
    id: '3',
    tenantId: 'tenant-123',
    name: 'Carlos Rodríguez',
    phone: '456789123',
    raffleId: 'raffle-3',
    raffleName: 'Rifa PlayStation 5',
    prize: 'PlayStation 5 + 2 Controles',
    winningNumber: 789,
    drawDate: new Date('2025-01-05'),
    photoUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    photoUploaded: true,
    isActive: true,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: '4',
    tenantId: 'tenant-123',
    name: 'Ana Martínez',
    phone: '321654987',
    raffleId: 'raffle-4',
    raffleName: 'Rifa Tablet Samsung',
    prize: 'Samsung Galaxy Tab S9 Ultra',
    winningNumber: 2156,
    drawDate: new Date('2024-12-28'),
    photoUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
    photoUploaded: true,
    isActive: true,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28')
  },
  {
    id: '5',
    tenantId: 'tenant-123',
    name: 'Roberto Silva',
    phone: '654321789',
    raffleId: 'raffle-5',
    raffleName: 'Rifa AirPods Pro',
    prize: 'AirPods Pro 2da Gen',
    winningNumber: 3421,
    drawDate: new Date('2024-12-20'),
    photoUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    photoUploaded: true,
    isActive: true,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  }
];