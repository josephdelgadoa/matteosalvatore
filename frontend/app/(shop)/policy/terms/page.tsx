import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl animate-fade-in text-ms-black">
            <h1 className="ms-heading-2 mb-8">Terms of Service</h1>

            <div className="prose prose-stone max-w-none space-y-6">
                <p>By accessing the website at <a href="https://matteosalvatore.pe" className="underline">matteosalvatore.pe</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on Matteo Salvatore's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Matteo Salvatore's website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Disclaimer</h3>
                <p>The materials on Matteo Salvatore's website are provided on an 'as is' basis. Matteo Salvatore makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Limitations</h3>
                <p>In no event shall Matteo Salvatore or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Matteo Salvatore's website.</p>

                <h3 className="text-lg font-medium mt-6 mb-2">Accuracy of Materials</h3>
                <p>The materials appearing on Matteo Salvatore's website could include technical, typographical, or photographic errors. Matteo Salvatore does not warrant that any of the materials on its website are accurate, complete or current. Matteo Salvatore may make changes to the materials contained on its website at any time without notice.</p>
            </div>
        </div>
    );
}
