import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule],
  providers: [AppComponent],
  bootstrap: [],
})
export class AppModule {}
