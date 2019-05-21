import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [NgbModule, NgJhipsterModule.forRoot({}), InfiniteScrollModule, CookieModule.forRoot(), FontAwesomeModule, ReactiveFormsModule],
    exports: [FormsModule, HttpClientModule, CommonModule, NgbModule, NgJhipsterModule, InfiniteScrollModule, FontAwesomeModule, ReactiveFormsModule]
})
export class JHipsterRegistrySharedLibsModule {
    static forRoot() {
        return {
            ngModule: JHipsterRegistrySharedLibsModule
        };
    }
}
