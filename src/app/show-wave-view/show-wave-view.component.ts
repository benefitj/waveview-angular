import { MqttClientService } from './../service/mqtt-client.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'show-wave-view',
  template: `
    <div>
      <div class="line-center" [ngStyle] ="{ width: width * 2, height: height * 2}">
        <wave-view [deviceId]="'01000341'" [width] = "width" [height] = "height"></wave-view>
        <wave-view [deviceId]="'01000342'" [width] = "width" [height] = "height"></wave-view>
      </div>
      <div class="line-center" [ngStyle] ="{ width: width * 2, height: height * 2}">
        <wave-view [deviceId]="'01000343'" [width] = "width" [height] = "height"></wave-view>
        <wave-view [deviceId]="'01000344'" [width] = "width" [height] = "height"></wave-view>
      </div>
    </div>
  `,
  styles: [`
    .line-center {
      /* text-align: center; */
      display: block;
      background: '#ff000000'
      /* width: 200px; */
       /* height: 200px; */
    }
  `],
  providers: [MqttClientService]
})
export class ShowWaveViewComponent implements OnInit, AfterViewInit {

  width: number;
  height: number;

  constructor() { }

  ngOnInit(): void {
    this.width = window.innerWidth / 2 - 30;
    this.height = window.innerHeight / 3 - 20;
    console.log('width: ' + this.width + ', height: ' + this.height);
  }

  ngAfterViewInit(): void {
    // this.width = window.innerWidth / 2 - 30;
    // this.height = window.innerHeight / 3 - 20;
    // console.log('width: ' + this.width + ', height: ' + this.height);
  }

}
