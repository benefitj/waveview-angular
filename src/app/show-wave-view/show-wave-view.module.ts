import { MqttClientService } from './../service/mqtt-client.service';
import { WaveViewComponent } from './wave-view.component';
import { ShowWaveViewRouting } from './show-wave-view.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    WaveViewComponent,
  ],
  imports: [
    CommonModule,
    ShowWaveViewRouting,
  ],
  exports: [
    WaveViewComponent,
  ],
  providers: [
    MqttClientService,
  ],
  // bootstrap: [WaveViewComponent]
})
export class ShowWaveViewModule { }
