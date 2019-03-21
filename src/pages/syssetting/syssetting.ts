import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { AlertController } from "ionic-angular";
import { AppConfig } from "../../ts/app.config";

/**
 * Generated class for the SyssettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-syssetting',
  templateUrl: 'syssetting.html',
})
export class SyssettingPage {

  sysLanguage:any;
  langs:any;
  RadioOpen: boolean;
  RadioResult:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public translate: TranslateService,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyssettingPage');
  }

  ionViewWillEnter(){
    let that = this;
    let curLang = AppConfig.systemCurLang;
    that.resetLangText(curLang);
  }

  /* 选择语言*/
  selectLang(){
    var that = this;
    that.langs = AppConfig.systemLangs;

    let alert = that.alertCtrl.create({
      enableBackdropDismiss:false
    });
    alert.setTitle(AppConfig.nknCrrrentTip.sysSetting.language);
    for (let lang of that.langs) {
      alert.addInput({
        type: 'radio',
        label: lang["language"],
        value: lang["type"],
        checked: (lang["type"] == that.translate.getDefaultLang() ? true : false)
      });
    }
    alert.addButton(AppConfig.nknCrrrentTip.common.cancle);
    alert.addButton({
      text: AppConfig.nknCrrrentTip.common.confirm,
      handler: data => {
        that.RadioOpen = false;
        that.RadioResult = data;
        that.resetLang(data);
      }
    });
    alert.present();
  }

  /* 语言重置 */
  resetLang(lang){
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.resetLangText(lang);
    AppConfig.systemCurLang = lang;
    AppConfig.setStorage('language',lang);
  }

  /* 语言选项显示 */
  resetLangText(lang){
    switch(lang){
      case 'zh':
        this.sysLanguage = '简体中文';
        AppConfig.nknCrrrentTip = AppConfig.nknTipArray[0];
        break;
      case 'en':
        this.sysLanguage = 'English';
        AppConfig.nknCrrrentTip = AppConfig.nknTipArray[1];
        break;
      case 'vi':
        this.sysLanguage = 'tiếng việt';
        AppConfig.nknCrrrentTip = AppConfig.nknTipArray[2];
        break;
      case 'ko':
        this.sysLanguage = '한국어';
        AppConfig.nknCrrrentTip = AppConfig.nknTipArray[3];
        break;
      default:
        break;
    }
  }

}
