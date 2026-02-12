'use client';

import React from 'react';
import { LoginSlider } from '@/components/admin/LoginSlider';
import { LoginForm } from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Column - Slider (50%) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 text-white relative flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/admin-bg-pattern.png')] bg-cover bg-center"></div>
                <div className="z-10 w-full max-w-lg px-8">
                    <LoginSlider />
                </div>
            </div>

            {/* Right Column - Login Form (50%) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Matteo Salvatore
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Admin Panel Access
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            Powered by Nexa Sphere OS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
