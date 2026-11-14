import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, TitleStrategy } from '@angular/router';

import { AccountService } from 'app/core/auth';
import Footer from '../footer/footer';
import PageRibbon from '../profiles/page-ribbon';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.html',
  imports: [RouterOutlet, Footer, PageRibbon],
})
export default class Main implements OnInit {
  private readonly router = inject(Router);
  private readonly titleStrategy = inject(TitleStrategy);
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
  }
}
