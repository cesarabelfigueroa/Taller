import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.controller';
import { AppComponent } from './components/app/app.controller';
import { AuthenticateService } from './services/authenticate.service';
import { routing } from './routes'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  exports: [],
  providers: [AuthenticateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
