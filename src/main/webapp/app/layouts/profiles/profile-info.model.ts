export interface InfoResponse {
  git?: any;
  build?: any;
  activeProfiles?: string[];
  'cloud-config-server-configuration-sources'?: Array<any>;
  'cloud-config-label'?: string;
}

export class ProfileInfo {
  constructor(
    public activeProfiles?: string[],
    public inProduction?: boolean,
    public openAPIEnabled?: boolean,
    public cloudConfigServerConfigurationSources?: Array<any>,
    public cloudConfigLabel?: string
  ) {}
}
