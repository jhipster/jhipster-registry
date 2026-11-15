import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApplicationsService } from './applications/applications.service';
import { ConfigService } from './config/config.service';
import { EncryptionService } from './encryption/encryption.service';
import { HistoryService } from './history/history.service';
import { ReplicasService } from './replicas/replicas.service';
import { SSHService } from './ssh/ssh.service';

describe('registry services', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('ApplicationsService', () => {
    it('should return the applications of the Eureka response', () => {
      const applications = [{ name: 'app1', instances: [{ instanceId: 'app1:1', status: 'UP' as const }] }];
      const next = vi.fn();

      TestBed.inject(ApplicationsService).findAll().subscribe(next);
      httpMock.expectOne({ method: 'GET', url: 'api/eureka/applications' }).flush({ applications });

      expect(next).toHaveBeenCalledWith(applications);
    });
  });

  describe('ConfigService', () => {
    it('should request the configuration by label, application, and profile in each format', () => {
      const service = TestBed.inject(ConfigService);

      service.getConfigAsYaml('app', 'prod', 'main').subscribe();
      service.getConfigAsProperties('app', 'prod', 'main').subscribe();
      service.getConfigAsJson('app', 'prod', 'main').subscribe();

      for (const extension of ['yml', 'properties', 'json']) {
        const request = httpMock.expectOne({ method: 'GET', url: `config/main/app-prod.${extension}` });
        expect(request.request.responseType).toBe('text');
        request.flush('');
      }
    });

    it('should request the configuration sources', () => {
      const next = vi.fn();

      TestBed.inject(ConfigService).getConfigSources().subscribe(next);
      httpMock.expectOne({ method: 'GET', url: 'api/config/sources' }).flush({ label: 'main', serverConfigurationSources: [] });

      expect(next).toHaveBeenCalledWith({ label: 'main', serverConfigurationSources: [] });
    });
  });

  describe('EncryptionService', () => {
    it('should prefix the encrypted value with {cipher}', () => {
      const next = vi.fn();

      TestBed.inject(EncryptionService).encrypt('secret').subscribe(next);
      const request = httpMock.expectOne({ method: 'POST', url: 'config/encrypt' });
      request.flush('0123abcd');

      expect(request.request.body).toBe('secret');
      expect(next).toHaveBeenCalledWith('{cipher}0123abcd');
    });

    it('should return the decrypted value as it is', () => {
      const next = vi.fn();

      TestBed.inject(EncryptionService).decrypt('0123abcd').subscribe(next);
      const request = httpMock.expectOne({ method: 'POST', url: 'config/decrypt' });
      request.flush('secret');

      expect(request.request.body).toBe('0123abcd');
      expect(next).toHaveBeenCalledWith('secret');
    });
  });

  describe('HistoryService', () => {
    it('should request the last registered and cancelled leases', () => {
      const history = { registered: { 1: 'APP(app:1)' }, canceled: {} };
      const next = vi.fn();

      TestBed.inject(HistoryService).findAll().subscribe(next);
      httpMock.expectOne({ method: 'GET', url: 'api/eureka/lastn' }).flush(history);

      expect(next).toHaveBeenCalledWith(history);
    });
  });

  describe('ReplicasService', () => {
    it('should request the replicas', () => {
      const next = vi.fn();

      TestBed.inject(ReplicasService).findAll().subscribe(next);
      httpMock.expectOne({ method: 'GET', url: 'api/eureka/replicas' }).flush(['localhost:8761']);

      expect(next).toHaveBeenCalledWith(['localhost:8761']);
    });
  });

  describe('SSHService', () => {
    it('should read the public key as text, because the endpoint does not answer JSON', () => {
      const next = vi.fn();

      TestBed.inject(SSHService).getSshPublicKey().subscribe(next);
      const request = httpMock.expectOne({ method: 'GET', url: 'api/ssh/public_key' });
      request.flush('ssh-rsa AAAA user@host');

      expect(request.request.responseType).toBe('text');
      expect(next).toHaveBeenCalledWith('ssh-rsa AAAA user@host');
    });
  });
});
