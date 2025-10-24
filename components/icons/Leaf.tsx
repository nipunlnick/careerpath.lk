
import React from 'react';

const Leaf: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12c0-5 2-9 6-10 2 0 4 1 5 3 1-2 3-3 5-3 4 1 6 5 6 10-2 2-5 3-7 3s-5-1-7-3z"/>
        <path d="M12 12v10"/>
    </svg>
);

export default Leaf;
