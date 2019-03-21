import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";
import { MyApp } from './app.component';
import { TranslateModule,TranslateLoader,TranslateStaticLoader} from "ng2-translate";
import { HttpModule, Http } from '@angular/http';

import { ComponentsModule} from "../components/components.module";
import { PipesModule } from "../pipes/pipes.module";

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { WalletlistPage } from "../pages/walletlist/walletlist";
import { CoinshowPage } from "../pages/coinshow/coinshow";
import { TransfercoinPage } from "../pages/transfercoin/transfercoin";
import { ImportwalletPage } from "../pages/importwallet/importwallet";
import { CreatewalletPage } from "../pages/createwallet/createwallet";
import { WalletsettingPage } from "../pages/walletsetting/walletsetting";
import { ExportkeystorePage } from "../pages/exportkeystore/exportkeystore";
import { FirstguidePage } from "../pages/firstguide/firstguide";
import { ScanqrcodePage } from "../pages/scanqrcode/scanqrcode";
import { TxrecordlistPage } from "../pages/txrecordlist/txrecordlist";
import { SwitchwalletPage } from "../pages/switchwallet/switchwallet";
import { JoingroupPage } from "../pages/joingroup/joingroup";
import { AboutusPage } from "../pages/aboutus/aboutus";
import { SyssettingPage } from "../pages/syssetting/syssetting";
import { NewsPage } from "../pages/news/news";
import { RecivecoinPage } from "../pages/recivecoin/recivecoin";
import { KeystorePage } from "../pages/keystore/keystore";
import { LanguagePage } from "../pages/language/language";
import { TxdetailPage } from "../pages/txdetail/txdetail";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from '@ionic-native/clipboard';
import { QRScanner } from '@ionic-native/qr-scanner';
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppVersion } from "@ionic-native/app-version";
import { AppupdateProvider } from "../providers/appupdate/appupdate";
import { GlobalProvider } from '../providers/global/global';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WalletlistPage,
    CoinshowPage,
    TransfercoinPage,
    ImportwalletPage,
    CreatewalletPage,
    WalletsettingPage,
    ExportkeystorePage,
    FirstguidePage,
    ScanqrcodePage,
    TxrecordlistPage,
    SwitchwalletPage,
    JoingroupPage,
    AboutusPage,
    SyssettingPage,
    NewsPage,
    RecivecoinPage,
    KeystorePage,
    LanguagePage,
    TxdetailPage
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:'true', //隐藏全部子页面
      backButtonText:"", //子页面头部返回文字
      swipeBackEnabled:'false', //是否启用ios轻扫返回功能
      tabsHighlight:'false', //选择时是否在选项卡下显示高光线
      iconMode: 'ios',
      mode:'ios'
    }),
    HttpClientModule,
    ComponentsModule,
    HttpModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WalletlistPage,
    CoinshowPage,
    TransfercoinPage,
    ImportwalletPage,
    CreatewalletPage,
    WalletsettingPage,
    ExportkeystorePage,
    FirstguidePage,
    ScanqrcodePage,
    TxrecordlistPage,
    SwitchwalletPage,
    JoingroupPage,
    AboutusPage,
    SyssettingPage,
    NewsPage,
    RecivecoinPage,
    KeystorePage,
    LanguagePage,
    TxdetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileOpener,
    InAppBrowser,
    AppVersion,
    FileTransfer,
    AppupdateProvider,
    GlobalProvider
  ]
})
export class AppModule {}
