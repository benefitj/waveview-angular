import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * 路由配置
 */
const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'component-and-template', redirectTo: 'component-and-template' }, // 组件与模板
    { path: 'show-wave-view', redirectTo: 'show-wave-view' }, // 组件与模板
    { path: '**', redirectTo: '/', pathMatch: 'full' } // 当没有匹配的路径时，默认匹配全部
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
    exports: [ RouterModule ]
})
export class AppRouting { }
