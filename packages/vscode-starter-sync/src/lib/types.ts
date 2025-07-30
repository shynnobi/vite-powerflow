export type Status = 'sync' | 'warning' | 'error';

export interface CheckResult {
  status: Status;
  message: string;
  commitCount: number;
}
