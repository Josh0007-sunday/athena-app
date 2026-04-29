import React from 'react';

interface ProtocolIconProps {
    protocol: 'lulo' | 'kamino' | 'jupiter' | 'umbra';
    size?: number;
    className?: string;
}

export default function ProtocolIcon({ protocol, size = 16, className = "" }: ProtocolIconProps) {
    const logos = {
        lulo: "https://app.lulo.fi/favicon.ico",
        kamino: "https://icons.llama.fi/kamino.jpg",
        jupiter: "https://jup.ag/favicon.ico",
        umbra: "https://app.umbra.cash/favicon.ico"
    };

    return (
        <img
            src={logos[protocol]}
            alt={`${protocol} logo`}
            style={{ width: size + 4, height: size + 4 }}
            className={`rounded-full shadow-sm object-cover ${className}`}
        />
    );
}
