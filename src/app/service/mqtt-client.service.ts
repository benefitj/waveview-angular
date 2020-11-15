

import PahoMqtt from '../../libs/paho.javascript-1.0.3/paho-mqtt';
import { random } from 'lodash';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { WaveView } from 'src/libs/wave-view';

/**
 * MQTT客户端
 */
@Injectable({
  providedIn: 'root',
})
export class MqttClientService implements OnDestroy {

  /**
   * 客户端
   */
  client: PahoMqtt.Client;
  /**
   * WaveView
   */
  readonly deviceViews: Map<string, WaveView> = new Map<string, WaveView>();

  constructor() {
    this.init();
  }

  /**
   * 创建时
   */
  init(): void {
    this.client = new PahoMqtt.Client('192.168.232.130', Number(28083), '/mqtt', "mqtt-device-ecg-" + random(1, 10000, false));
    // set callback handlers
    // called when the client loses its connection
    this.client.onConnectionLost = (responseObject: any) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    };
    // called when a message arrives
    this.client.onMessageArrived = (message: any) => {
      //console.log("onMessageArrived:" + message.payloadString);
      const packet = JSON.parse(message.payloadString);
      const v: WaveView = this.deviceViews.get(packet.deviceId);
      if (v) {
        v.push([packet.ecgList, packet.respList, packet.abdominalList]);
      }
    };

    // connect the client
    this.client.connect({
      userName: 'admin',
      password: 'public',
      //   onSuccess: onConnect
      onSuccess: () => {
        console.log("onConnect");

        // 订阅主题
        this.deviceViews.forEach((value, key) =>
          this.client.subscribe("/device/collector/" + key, null as any));

        // message = new Paho.MQTT.Message("Hello");
        // message.destinationName = "World";
        // client.send(message);
      }
    });
    console.log('连接MQTT服务');
  }

  /**
   * 订阅主题
   *
   * @param deviceId 设备ID
   * @param view  视图
   */
  subscribe(deviceId: string, view: WaveView): void {
    if (!this.client) {
      console.log('客户端还不可用');
      return;
    }

    // 订阅主题
    this.deviceViews.set(deviceId, view);
    if(this.client.connected) {
      this.client.subscribe("/device/collector/" + deviceId, null as any);
    }
  }

  /**
   * 取消订阅
   *
   * @param deviceId 设备ID
   */
  unsubscribe(deviceId: string): void {
    this.deviceViews.delete(deviceId);
    this.client.unsubscribe("/device/collector/" + deviceId, null as any);
  }

  /**
   * 销毁时
   */
  ngOnDestroy(): void {
    this.client.disconnect();
  }

}
