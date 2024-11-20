import React from 'react';
import { useModal } from './ModalContext';
import { TrainerDetailed } from '../trainer/TrainerDetailed';

export const Modal: React.FC = () => {
    const { isOpen, closeModal, id } = useModal();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg relative">
                <button onClick={closeModal} className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded">
                    X
                </button>
                <TrainerDetailed id={id!} />
            </div>
        </div>
    );
};