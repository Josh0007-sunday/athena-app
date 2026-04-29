import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import BetaGate from '../components/BetaGate';
import athenaLoginImg from '../assets/athenalogin.png';

export default function Connect() {
    const [granted, setGranted] = useState(
        sessionStorage.getItem('beta_access') === 'granted'
    );

    if (!granted) {
        return <BetaGate onSuccess={() => setGranted(true)} />;
    }

    return (
        <div className="min-h-screen w-full flex bg-white font-sans text-stone-900">
            {/* Left side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 xl:p-24">
                <AuthForm />
            </div>

            {/* Right side: Image overlay */}
            <div className="hidden lg:block lg:w-1/2 p-4">
                <div className="relative w-full h-full rounded-sm overflow-hidden bg-stone-100">
                    <img
                        src={athenaLoginImg}
                        alt="Athena Login Graphic"
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[10%]"
                    />
                </div>
            </div>
        </div>
    );
}
