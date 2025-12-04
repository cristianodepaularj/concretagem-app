import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, Branch } from '../types';

interface DataContextType {
    orders: Order[];
    branches: Branch[];
    addOrder: (order: Omit<Order, 'id' | 'status'>) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_BRANCHES: Branch[] = [
    { name: 'PIRACICABA', truckCount: 15, goalPerTruck: 30 },
    { name: 'SANTA BARBARA', truckCount: 10, goalPerTruck: 30 },
    { name: 'RIO CLARO', truckCount: 7, goalPerTruck: 30 },
];


export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [branches] = useState<Branch[]>(INITIAL_BRANCHES); // Keep branches hardcoded for now or fetch if table exists

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*');

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'status'>) => {
        const newOrder = {
            ...orderData,
            status: 'Pending'
        };

        const { data, error } = await supabase
            .from('orders')
            .insert([newOrder])
            .select()
            .single();

        if (error) {
            console.error('Error adding order:', error);
        } else if (data) {
            setOrders([...orders, data]);
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating order status:', error);
        } else {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
    };

    return (
        <DataContext.Provider value={{ orders, branches, addOrder, updateOrderStatus }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
