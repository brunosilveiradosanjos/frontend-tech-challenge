import React, { createContext, useState, useContext } from 'react';

interface ModalContextType {
    openModal: (id: number) => void;
    closeModal: () => void;
    isOpen: boolean;
    id: number | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const ModalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);

    const openModal = (id: number) => {
        setId(id);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setId(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen, id }}>
            {children}
        </ModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};