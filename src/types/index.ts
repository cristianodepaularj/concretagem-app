export type Role = 'admin' | 'consultant';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string;
    branch?: string; // For consultants restricted to a branch
}

export interface Order {
    id: string;
    dateRequest: string; // Data Solicitação
    status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled';
    branch: string; // Filial
    consultantId: string;
    consultantName: string;
    client: string;
    volume: number;
    pumpType: string; // Bomba
    concreteDate: string; // Data Concretagem
    notes?: string;
}

export interface Branch {
    name: string;
    truckCount: number;
    goalPerTruck: number;
}
