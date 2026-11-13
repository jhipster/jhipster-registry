import { environment } from 'environments/environment';

const { VERSION } = environment;

/** The version of the registry with a leading "v", or an empty string when it is not known. */
export const displayVersion = formatVersion(VERSION);

export function formatVersion(version: string | undefined): string {
  if (!version) {
    return '';
  }
  return version.toLowerCase().startsWith('v') ? version : `v${version}`;
}
