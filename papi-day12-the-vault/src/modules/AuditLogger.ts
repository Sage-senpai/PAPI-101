export type LogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLog {
  timestamp: string;
  level: LogLevel;
  action: string;
  details: string;
}

/**
 * AuditLogger provides comprehensive audit trail for all security operations
 */
export class AuditLogger {
  private logs: AuditLog[] = [];
  private maxLogs: number = 1000;

  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }

  /**
   * Log an action with details
   */
  logAction(
    action: string,
    level: LogLevel = 'info',
    metadata?: Record<string, unknown>
  ): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      level,
      action,
      details: metadata ? JSON.stringify(metadata, null, 2) : ''
    };

    this.logs.push(log);

    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for development
    const logMethod = level === 'error' || level === 'critical' ? 'error' : 
                     level === 'warning' ? 'warn' : 'log';
    console[logMethod](`[${level.toUpperCase()}] ${action}:`, metadata);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): AuditLog[] {
    return this.logs.slice(-count).reverse();
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): AuditLog[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs in date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Search logs by action
   */
  searchLogs(query: string): AuditLog[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.action.toLowerCase().includes(lowerQuery) ||
      log.details.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    this.logAction('logs_cleared', 'info');
  }

  /**
   * Get total log count
   */
  getLogCount(): number {
    return this.logs.length;
  }

  /**
   * Get logs summary
   */
  getLogsSummary(): Record<LogLevel, number> {
    const summary: Record<LogLevel, number> = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };

    this.logs.forEach(log => {
      summary[log.level]++;
    });

    return summary;
  }
}