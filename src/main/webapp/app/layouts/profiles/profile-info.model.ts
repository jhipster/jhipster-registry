export interface InfoResponse {
  git?: any;
  build?: any;
  activeProfiles?: string[];
}

export class ProfileInfo {
  constructor(public activeProfiles?: string[], public inProduction?: boolean, public openAPIEnabled?: boolean) {}
}
