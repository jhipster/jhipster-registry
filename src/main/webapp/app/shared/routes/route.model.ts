export interface Route {
  path: string;
  prefix: string;
  appName: string;
  status: InstanceStatus;
  serviceId: string;
}

export type InstanceStatus = 'UP' | 'DOWN' | 'STARTING' | 'OUT_OF_SERVICE' | 'UNKNOWN';
