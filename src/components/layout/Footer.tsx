"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Navigation");

    return (
        <footer style={{
            backgroundColor: 'var(--color-black)',
            color: 'var(--color-white)',
            padding: 'var(--spacing-2xl) 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-xl)'
            }}>
                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Matteo Salvatore</h3>
                    <p style={{ opacity: 0.7 }}>
                        Timeless elegance for the modern man.
                    </p>
                </div>
                <div>
                    <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Links</h4>
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: 'var(--spacing-sm)' }}>Shop</li>
                        <li style={{ marginBottom: 'var(--spacing-sm)' }}>About</li>
                        <li style={{ marginBottom: 'var(--spacing-sm)' }}>Contact</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Contact</h4>
                    <p style={{ opacity: 0.7 }}>Av. San Borja Norte 524, San Borja</p>
                    <p style={{ opacity: 0.7 }}>Lima, Perú</p>
                </div>
            </div>
            <div className="container" style={{
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                fontSize: '0.8rem',
                opacity: 0.5
            }}>
                &copy; {new Date().getFullYear()} Inversiones Matteo Salvatore SAC. All rights reserved.
            </div>
        </footer>
    );
}
