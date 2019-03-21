import { NgModule } from '@angular/core';
import { TranslateModule,TranslateLoader,TranslateStaticLoader} from "ng2-translate";
import { NoscreenshotComponent } from './noscreenshot/noscreenshot';
import { WalletqrcodeComponent } from './walletqrcode/walletqrcode';
import { Http } from "@angular/http";

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
	declarations: [NoscreenshotComponent,
    WalletqrcodeComponent,
    ],
	imports: [
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
  ],
	exports: [NoscreenshotComponent,
    WalletqrcodeComponent,
    ]
})
export class ComponentsModule {}
