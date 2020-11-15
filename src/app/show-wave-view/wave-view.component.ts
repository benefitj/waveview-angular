import { MqttClientService } from './../service/mqtt-client.service';

import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { WaveView, ViewModel, setCanvasPixelRatio, getOrDefault } from '../../libs/wave-view';

@Component({
  selector: 'wave-view',
  template: `
    <div>
      <button (click)="start()" title="start" class="btn">开始绘制</button>
      <button (click)="stop()" title="start" class="btn">停止绘制</button>
      <div>
        <div>设备ID: {{ deviceId }}</div>
        <span>
            <canvas #wvCanvas class="wave-view" [width]="600" [height]="200">Canvas not supported</canvas>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .wave-view {
      /* position: fixed; relative; absolute */
      /* position: absolute; */
      position: relative;
      left: 0px;
      top: 0px;
      margin: 3px;
      background: #000000;
      border: thin solid #aaaaaa;
    }
    .btn {
      margin: 3px;
    }
  `]
})
export class WaveViewComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Canvas
   */
  @ViewChild('wvCanvas')
  public canvasRef: ElementRef;
  /**
   * 宽度
   */
  @Input()
  width: number;
  /**
   * 高度
   */
  @Input()
  height: number;
  /**
   * 波形图
   */
  view?: WaveView;
  /**
   * 设备ID
   */
  @Input()
  deviceId: string;

  private service: MqttClientService;

  constructor(service: MqttClientService) {
    this.service = service;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.view = createWaveView(this.canvasRef.nativeElement);
    setCanvasPixelRatio(this.view.canvas, this.width, this.height);
    console.log('setCanvasPixelRatio(' + this.width + ', ' + this.height + ')');

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.view.pause();
      } else {
        this.view.resume();
      }
    });

    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }

    // 订阅主题
    this.service.subscribe(this.deviceId, this.view);
  }
  /**
   * 开始绘制
   */
  start(): void {
    this.ngOnInit();
    this.view.start();
  }

  /**
   * 停止绘制
   */
  stop(): void {
    this.view.stop();
  }

  ngOnDestroy(): void {
    // 取消订阅
    this.service.unsubscribe(this.deviceId);
  }

}




// 40毫秒执行一次
// 心电每秒200个值      每次绘制8个值
// 脉搏波每秒50个值     每次绘制2个值
// 胸腹呼吸每秒25个值   每次绘制1个值
export function createWaveView(c: HTMLCanvasElement): WaveView {
  return new WaveView(c, {
    // 初始化
    onInit(view: WaveView): void {
      const canvas = view.canvas;
      const step = 0.5;
      // 添加ViewModel
      view.models.push(
        // 创建心电
        new ViewModel({
          width: canvas.width, // 宽度
          height: canvas.height / 2, // 高度
          drawCount: 8, // 绘制点数
          median: 512, // 中值 = (最大值 - 最小值) / 2
          step: step, // 步长
          baseLine: (canvas.height / 4), // 基线
          maxCacheSize: 2, // 缓存数量
          scaleRatio: 0.8, // 缩放比
          padding: 16, // 空白填充
          startX: 0,
          startY: 0,
          strokeStyle: '#FF0000'
        }),
        // 创建胸呼吸
        new ViewModel({
          width: canvas.width, // 宽度
          height: canvas.height / 2, // 高度
          clearDirty: true, // 清理视图
          drawCount: 1, // 绘制点数
          median: 512, // 中值 = (最大值 - 最小值) / 2
          step: step * 8, // 步长
          baseLine: canvas.height * (3 / 4.0), // 基线
          maxCacheSize: 2, // 缓存数量
          scaleRatio: 0.6, // 缩放比
          padding: 16, // 空白填充
          startX: 0,
          startY: canvas.height / 2 - 2,
          strokeStyle: '#00FF00'
        }),
        // 创建腹呼吸
        new ViewModel({
          width: canvas.width, // 宽度
          height: canvas.height / 2, // 高度
          clearDirty: false, // 不清理视图
          drawCount: 1, // 绘制点数
          median: 512, // 中值 = (最大值 - 最小值) / 2
          step: step * 8, // 步长
          baseLine: canvas.height * (3 / 4.0), // 基线
          maxCacheSize: 2, // 缓存数量
          scaleRatio: 0.6, // 缩放比
          padding: 16, // 空白填充
          startX: 0,
          startY: canvas.height / 2 + 2,
          strokeStyle: '#FFFF00'
        })
      );


      // let ctx = view.ctx;
      // // 清理视图
      // view.models.forEach(m => m.clear(ctx));
      // 打印参数
      // for (const model of view.models) {
      //   console.log(JSON.stringify(model));
      // }

      // view.onDrawBackground = function (ctx: CanvasRenderingContext2D) {
      //     ctx.lineWidth = 3;
      //     ctx.strokeStyle = "#FFFFFFFF";
      //     ctx.lineCap = "round";
      //     ctx.lineJoin = "round";

      //     ctx.beginPath();
      //     ctx.moveTo(0, this.height() / 2);
      //     ctx.lineTo(this.width(), this.height() / 2);
      //     ctx.stroke();
      //     console.log('绘制背景');
      // }

    }
  }, 40);
}

