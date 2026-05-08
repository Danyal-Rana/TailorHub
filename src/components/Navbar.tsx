import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Users, ClipboardList } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Scissors className="h-8 w-8" />
                            <span className="font-bold text-xl">Tailors Hub</span>
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/" className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center space-x-1">
                            <ClipboardList className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/orders" className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center space-x-1">
                            <ClipboardList className="h-4 w-4" />
                            <span>Orders</span>
                        </Link>
                        <Link to="/customers" className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>Customers</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
