import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import SSH from './ssh';
import { SSHService } from './ssh.service';

describe('SSH Component', () => {
  let comp: SSH;
  let service: SSHService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    comp = TestBed.createComponent(SSH).componentInstance;
    service = TestBed.inject(SSHService);
  });

  it('should show the public key', () => {
    vi.spyOn(service, 'getSshPublicKey').mockReturnValue(of('ssh-rsa AAAA user@host'));

    comp.ngOnInit();

    expect(comp.data()).toBe('ssh-rsa AAAA user@host');
  });

  it('should show nothing when the server has no public key', () => {
    vi.spyOn(service, 'getSshPublicKey').mockReturnValue(throwError(() => new Error('not found')));

    comp.ngOnInit();

    expect(comp.data()).toBe('');
  });
});
