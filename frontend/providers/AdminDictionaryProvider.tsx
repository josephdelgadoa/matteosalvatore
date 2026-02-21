'use client';

import React, { createContext, useContext } from 'react';

// Using 'any' for dict to allow flexible nested structures, type more strictly later if needed.
type AdminDictionaryContextType = any;

const AdminDictionaryContext = createContext<AdminDictionaryContextType | null>(null);

export const AdminDictionaryProvider = ({
    children,
    dictionary
}: {
    children: React.ReactNode;
    dictionary: any;
}) => {
    return (
        <AdminDictionaryContext.Provider value={dictionary}>
            {children}
        </AdminDictionaryContext.Provider>
    );
};

export const useAdminDictionary = () => {
    const context = useContext(AdminDictionaryContext);
    if (!context) {
        throw new Error('useAdminDictionary must be used within an AdminDictionaryProvider');
    }
    return context;
};
