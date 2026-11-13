export type HealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export type HealthKey =
  | 'discoveryComposite'
  | 'refreshScope'
  | 'clientConfigServer'
  | 'hystrix'
  | 'diskSpace'
  | 'ssl'
  | 'mail'
  | 'ping'
  | 'livenessState'
  | 'readinessState';

export interface HealthModel {
  status: HealthStatus;
  components?: Partial<Record<HealthKey, HealthDetails>>;
}

export interface HealthDetails {
  status: HealthStatus;
  details?: Record<string, unknown>;
}
