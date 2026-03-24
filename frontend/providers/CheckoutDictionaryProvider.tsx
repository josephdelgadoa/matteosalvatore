'use client';

import React, { createContext, useContext } from 'react';

type CheckoutDictionaryContextType = {
    dict: any;
    lang: string;
};

const CheckoutDictionaryContext = createContext<CheckoutDictionaryContextType | null>(null);

export const CheckoutDictionaryProvider = ({
    children,
    dictionary,
    lang
}: {
    children: React.ReactNode;
    dictionary: any;
    lang: string;
}) => {
    return (
        <CheckoutDictionaryContext.Provider value={{ dict: dictionary, lang }}>
            {children}
        </CheckoutDictionaryContext.Provider>
    );
};

export const useCheckoutDictionary = () => {
    const context = useContext(CheckoutDictionaryContext);
    if (!context) {
        throw new Error('useCheckoutDictionary must be used within a CheckoutDictionaryProvider');
    }
    return context;
};
