import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'applications',
        loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule),
      },
      {
        path: 'config',
        loadChildren: () => import('./config/config.module').then(m => m.ConfigModule),
      },
      {
        path: 'encryption',
        loadChildren: () => import('./encryption/encryption.module').then(m => m.EncryptionModule),
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'replicas',
        loadChildren: () => import('./replicas/replicas.module').then(m => m.ReplicasModule),
      },
      {
        path: 'ssh',
        loadChildren: () => import('./ssh/ssh.module').then(m => m.SSHModule),
      },
    ]),
  ],
})
export class RegistryRoutingModule {}
