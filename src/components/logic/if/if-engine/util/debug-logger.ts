export type LogLevel = 'none' | 'basic' | 'verbose';

interface LogEntry {
    step: string;
    path: string;
    context?: any;
    result?: any;
}

class DebugLogger {
    private enabled: LogLevel = 'verbose';
    private logs: LogEntry[] = [];

    setLevel(level: LogLevel) {
        this.enabled = level;
    }

    log(entry: LogEntry) {
        /*if (this.enabled === 'none') return;

        this.logs.push(entry);

        if (this.enabled === 'verbose') {
            //console.group(`IF Engine - ${entry.step}`);
            //console.log('Path:', entry.path);
            if (entry.context) console.log('Context:', entry.context);
            if (entry.result) console.log('Result:', entry.result);
            //console.groupEnd();
        } else if (this.enabled === 'basic') {
            //console.log(`IF Engine - ${entry.step} at ${entry.path}`);
        }*/
    }

    clear() {
        this.logs = [];
    }

    getLogs() {
        return [...this.logs];
    }
}

export const debugLogger = new DebugLogger(); 