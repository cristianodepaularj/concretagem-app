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
    clientPhone?: string; // Telefone do cliente
    volume: number;
    pumpType: string; // Bomba
    concreteDate: string; // Data Concretagem
    concreteTime?: string; // Hora da Concretagem
    fck?: number; // FCK
    contract?: number; // Contrato
    notes?: string; // Observações gerais
    observations?: string; // Observações adicionais
}

export interface Branch {
    name: string;
    truckCount: number;
    goalPerTruck: number;
}
