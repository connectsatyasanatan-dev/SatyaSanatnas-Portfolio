// Toast notification system for admin panel

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

class ToastManager {
    private static instance: ToastManager
    private toasts: Toast[] = []
    private listeners: ((toasts: Toast[]) => void)[] = []

    private constructor() { }

    static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager()
        }
        return ToastManager.instance
    }

    subscribe(listener: (toasts: Toast[]) => void) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notify() {
        this.listeners.forEach(listener => listener([...this.toasts]))
    }

    show(message: string, type: ToastType = 'info', duration: number = 5000) {
        const id = Math.random().toString(36).substring(2, 9)
        const toast: Toast = { id, message, type, duration }

        this.toasts.push(toast)
        this.notify()

        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(id)
            }, duration)
        }

        return id
    }

    success(message: string, duration?: number) {
        return this.show(message, 'success', duration)
    }

    error(message: string, duration?: number) {
        return this.show(message, 'error', duration)
    }

    warning(message: string, duration?: number) {
        return this.show(message, 'warning', duration)
    }

    info(message: string, duration?: number) {
        return this.show(message, 'info', duration)
    }

    dismiss(id: string) {
        this.toasts = this.toasts.filter(toast => toast.id !== id)
        this.notify()
    }

    clear() {
        this.toasts = []
        this.notify()
    }

    getToasts() {
        return [...this.toasts]
    }
}

export const toast = ToastManager.getInstance()

// React hook for using toast
export const useToast = () => {
    return {
        success: (message: string, duration?: number) => toast.success(message, duration),
        error: (message: string, duration?: number) => toast.error(message, duration),
        warning: (message: string, duration?: number) => toast.warning(message, duration),
        info: (message: string, duration?: number) => toast.info(message, duration),
        dismiss: (id: string) => toast.dismiss(id),
        clear: () => toast.clear()
    }
}