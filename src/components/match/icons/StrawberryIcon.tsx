import React from 'react';

export const ThemeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C9.25 2 7 4.25 7 7c0 1.5.63 2.83 1.63 3.75L4 18c-1.1 0-2 .9-2 2v1h1.5c1.38 0 2.5-1.12 2.5-2.5S5.38 16 4 16h2.5l4.5-8.25C11.5 8 11.74 8 12 8s.5 0 .5.25L17 16h2.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5H21v-1c0-1.1-.9-2-2-2l-4.63-7.25C15.37 9.83 16 8.5 16 7c0-2.75-2.25-5-5-5zM12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1zM9.5 4c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" fill="#4CAF50" />
  </svg>
);
