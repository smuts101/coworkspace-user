import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private router: Router) {
    // location.reload();
    // window.stop();
  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.router.navigate(["working-spaces"]);
    },5000);
  }
  ngOnInit() {
    // location.reload();
    // window.stop();
  }
}