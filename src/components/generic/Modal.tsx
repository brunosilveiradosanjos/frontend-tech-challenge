import React from 'react';
import { useModal } from './ModalContext';
import { TrainerDetailed } from '../trainer/TrainerDetailed';

export const Modal: React.FC = () => {
    const { isOpen, closeModal, id } = useModal();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
                <TrainerDetailed id={id!} />
                <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};