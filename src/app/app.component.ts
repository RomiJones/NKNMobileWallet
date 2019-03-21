import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { FirstguidePage } from "../pages/firstguide/firstguide";
import { AppConfig } from "../ts/app.config";
import { TranslateService } from "ng2-translate";
import { ToastController } from "ionic-angular";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,translate:TranslateService,public toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      //关闭启动页
      splashScreen.hide();
      //初始化基础信息
      AppConfig.initBasicInfo();
      //设置默认语言包
      let lang = AppConfig.getStorage('language');
      if(!lang){
        let defaultLang = 'en';
        translate.setDefaultLang(defaultLang);
        AppConfig.systemCurLang = defaultLang;
        AppConfig.setStorage('language',defaultLang);
      }else {
        translate.setDefaultLang(lang);
      }

      //初始化提示信息
      AppConfig.getNknTipObject();

      if(platform.is('ios')){
        AppConfig.deviceSys='ios';
        statusBar.styleDefault();
      }else if(platform.is('android')){
        AppConfig.deviceSys='android';
      }
    });

    let isFirst = AppConfig.getStorage("isFirstEnter");
    if(isFirst == "no"){
      this.rootPage = TabsPage;
    }else {
      this.rootPage = FirstguidePage;
    }

    if(AppConfig.isDebug){
      const toast = this.toastCtrl.create({
        message: '请注意，当前为Debug模式',
        duration: 5000,
        position: 'top'
      });
      toast.present();
    }
  }

}
