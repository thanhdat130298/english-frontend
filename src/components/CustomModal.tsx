import React from 'react';
import { CustomModalProps } from '../types';
import '../styles/main.scss';

const CustomModal: React.FC<CustomModalProps> = ({ show, title, message, onConfirm, onCancel, showCancel = false }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fadeInUp">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {showCancel && onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                            Hủy
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-md"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal; 