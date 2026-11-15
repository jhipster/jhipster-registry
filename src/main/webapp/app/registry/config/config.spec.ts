import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ProfileService } from 'app/layouts/profiles/profile.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import Config, { parseProperties } from './config';
import { ConfigService } from './config.service';

describe('Config Component', () => {
  let comp: Config;
  let configService: ConfigService;
  let profileService: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    comp = TestBed.createComponent(Config).componentInstance;
    configService = TestBed.inject(ConfigService);
    profileService = TestBed.inject(ProfileService);
    vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['dev'] }));
    vi.spyOn(configService, 'getConfigSources').mockReturnValue(of({ label: 'develop', serverConfigurationSources: [{ type: 'git' }] }));
    vi.spyOn(configService, 'getConfigAsYaml').mockReturnValue(of('a: b'));
    vi.spyOn(configService, 'getConfigAsProperties').mockReturnValue(of('a: b\n'));
    vi.spyOn(configService, 'getConfigAsJson').mockReturnValue(of('{"a":"b"}'));
  });

  it('should fetch the configuration with the label of the config server', () => {
    comp.ngOnInit();

    expect(configService.getConfigAsYaml).toHaveBeenCalledTimes(1);
    expect(configService.getConfigAsYaml).toHaveBeenCalledWith('application', 'prod', 'develop');
    expect(comp.configurationSources()).toEqual([{ type: 'git' }]);
    expect(comp.configAsYaml()).toBe('a: b');
    expect(comp.configAsJson()).toBe('{"a":"b"}');
    expect(comp.configAsKeyValuePairs()).toEqual(new Map([['a', 'b']]));
  });

  it('should fetch the configuration with the default label when the sources cannot be read', () => {
    vi.spyOn(configService, 'getConfigSources').mockReturnValue(throwError(() => new Error('failed')));

    comp.ngOnInit();

    expect(configService.getConfigAsYaml).toHaveBeenCalledWith('application', 'prod', 'main');
  });

  it('should tell whether the registry uses the native profile', () => {
    comp.ngOnInit();
    expect(comp.isNative()).toBe(false);

    vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['dev', 'native'] }));
    comp.ngOnInit();
    expect(comp.isNative()).toBe(true);
  });

  it('should fetch the configuration again on refresh', () => {
    comp.ngOnInit();
    comp.application = 'app1';

    TestBed.inject(RefreshService).refreshReload();

    expect(configService.getConfigAsYaml).toHaveBeenLastCalledWith('app1', 'prod', 'develop');
  });

  it('should clear the configuration when it cannot be read', () => {
    vi.spyOn(configService, 'getConfigAsYaml').mockReturnValue(throwError(() => new Error('failed')));

    comp.ngOnInit();

    expect(comp.configAsYaml()).toBe('');
  });

  describe('parseProperties', () => {
    it('should keep values that contain the separator', () => {
      const properties = parseProperties('logging.pattern.console: %d{HH:mm:ss} %-5level: %msg\nserver.port: 8761');

      expect(properties.get('logging.pattern.console')).toBe('%d{HH:mm:ss} %-5level: %msg');
      expect(properties.get('server.port')).toBe('8761');
    });

    it('should skip blank lines', () => {
      expect([...parseProperties('a: b\n\n').keys()]).toEqual(['a']);
    });

    it('should keep a property without a value', () => {
      expect(parseProperties('empty:').get('empty')).toBe('');
    });
  });
});
