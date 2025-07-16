export interface CustomModalProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
} 