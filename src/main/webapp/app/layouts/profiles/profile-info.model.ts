export interface InfoResponse {
  'display-ribbon-on-profiles'?: string;
  git?: any;
  build?: any;
  activeProfiles?: string[];
  'cloud-config-server-configuration-sources'?: Array<any>;
  'cloud-config-label'?: string;
}

export class ProfileInfo {
  constructor(
    public activeProfiles?: string[],
    public ribbonEnv?: string,
    public inProduction?: boolean,
    public swaggerEnabled?: boolean,
    public cloudConfigServerConfigurationSources?: Array<any>,
    public cloudConfigLabel?: string
  ) {}
}
