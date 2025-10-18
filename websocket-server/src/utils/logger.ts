interface LogContext {
    [key: string]: any;
}

class Logger {
    info(message: string, context?: LogContext): void {
        console.log('--------------------------------------------------');
        console.log(`▼ ${message}`);
        if (context) {
            Object.entries(context).forEach(([key, value]) => {
                console.log(`> ${key}:`, value);
            });
        }
        console.log('--------------------------------------------------');
    }

    error(message: string, context?: LogContext): void {
        console.error('--------------------------------------------------');
        console.error(`❌ ${message}`);
        if (context) {
            Object.entries(context).forEach(([key, value]) => {
                console.error(`> ${key}:`, value);
            });
        }
        console.error('--------------------------------------------------');
    }
}

export const logger = new Logger();
