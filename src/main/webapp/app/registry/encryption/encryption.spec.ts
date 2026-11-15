import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import Encryption from './encryption';
import { EncryptionService } from './encryption.service';

describe('Encryption Component', () => {
  let comp: Encryption;
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    comp = TestBed.createComponent(Encryption).componentInstance;
    service = TestBed.inject(EncryptionService);
  });

  it('should show the encrypted value and carry it over to the decrypt form', () => {
    vi.spyOn(service, 'encrypt').mockReturnValue(of('{cipher}0123abcd'));
    comp.textToEncrypt = 'secret';

    comp.encrypt();

    expect(service.encrypt).toHaveBeenCalledWith('secret');
    expect(comp.result()).toBe('{cipher}0123abcd');
    expect(comp.encryptedText).toBe('{cipher}0123abcd');
  });

  it('should strip the {cipher} prefix before decrypting', () => {
    vi.spyOn(service, 'decrypt').mockReturnValue(of('secret'));
    comp.encryptedText = '{cipher}0123abcd';

    comp.decrypt();

    expect(service.decrypt).toHaveBeenCalledWith('0123abcd');
    expect(comp.result()).toBe('secret');
    expect(comp.textToEncrypt).toBe('secret');
  });

  it('should clear the result when encrypting or decrypting fails', () => {
    vi.spyOn(service, 'encrypt').mockReturnValue(throwError(() => new Error('failed')));
    vi.spyOn(service, 'decrypt').mockReturnValue(throwError(() => new Error('failed')));
    comp.result.set('old');

    comp.encrypt();
    expect(comp.result()).toBe('');

    comp.result.set('old');
    comp.decrypt();
    expect(comp.result()).toBe('');
  });
});
