import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';
import { JHipsterRegistryCoreModule } from 'app/core/core.module';
import { JHipsterRegistryAppRoutingModule } from './app-routing.module';
import { JHipsterRegistryHomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    JHipsterRegistrySharedModule,
    JHipsterRegistryCoreModule,
    JHipsterRegistryHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    JHipsterRegistryAppRoutingModule
  ],
  declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [JhiMainComponent]
})
export class JHipsterRegistryAppModule {}
