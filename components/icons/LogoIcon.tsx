
import React from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M48 16C48 8.26801 41.732 2 34 2C26.268 2 20 8.26801 20 16V48C20 55.732 26.268 62 34 62H48" stroke="#16A34A" stroke-width="4" vector-effect="non-scaling-stroke"/>
        <circle cx="48" cy="16" r="4" fill="#FBBF24"/>
    </svg>
);

export default LogoIcon;