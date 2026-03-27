'use client';

import React, { createContext, useContext } from 'react';

type ShopDictionaryContextType = any;

const ShopDictionaryContext = createContext<ShopDictionaryContextType | null>(null);

export const ShopDictionaryProvider = ({
    children,
    dictionary
}: {
    children: React.ReactNode;
    dictionary: any;
}) => {
    return (
        <ShopDictionaryContext.Provider value={dictionary}>
            {children}
        </ShopDictionaryContext.Provider>
    );
};

export const useShopDictionary = () => {
    const context = useContext(ShopDictionaryContext);
    if (!context) {
        throw new Error('useShopDictionary must be used within a ShopDictionaryProvider');
    }
    return context;
};
