
export enum ServiceType {
  GARDENING = 'Gartenpflege',
  REPAIR = 'Reparaturen',
  CLEANING = 'Gebäudereinigung',
  WINTER = 'Winterdienst',
  RENOVATION = 'Renovierung'
}

export interface BookingRequest {
  id: string;
  serviceType: ServiceType;
  description: string;
  status: 'pending' | 'scheduled' | 'completed';
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
