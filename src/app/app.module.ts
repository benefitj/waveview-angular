import { ShowWaveViewComponent } from './show-wave-view/show-wave-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ShowWaveViewModule } from './show-wave-view/show-wave-view.module';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowWaveViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRouting, // 路由配置
    ShowWaveViewModule, // 展示波形图
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
