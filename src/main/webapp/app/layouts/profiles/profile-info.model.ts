export interface InfoResponse {
  git?: any;
  build?: any;
  activeProfiles?: string[];
  discovery?: {
    backend?: string;
  };
}

export class ProfileInfo {
  constructor(public activeProfiles?: string[], public inProduction?: boolean, public openAPIEnabled?: boolean, public backend?: string) {}
}
