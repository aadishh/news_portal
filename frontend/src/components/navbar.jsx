import React from 'react';
import logo from '../images/logo.png';

export const Navbar = () => {
    return (
        <div className="bg-cyan-200">
            <div className="container mx-auto flex justify-between items-center py-4">
                <img src={logo} alt="Logo" className="h-12" />
                <ul className="flex flex-row gap-4">
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Entertainment</li>
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Business</li>
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Sports</li>
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Style</li>
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Technology</li>
                    <li className="text-gray-800 hover:text-gray-900 cursor-pointer">Weather</li>
                </ul>
                <button className="px-4 py-2 bg-white text-gray-800 hover:text-gray-900 rounded-md border border-gray-400 hover:border-gray-500">Login</button>
            </div>
        </div>
    );
};
