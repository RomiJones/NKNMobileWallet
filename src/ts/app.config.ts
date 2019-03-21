///<reference path="extend.d.ts"/>

export class AppConfig{

  /* Debug模式标记 */
  public static isDebug:boolean = true;

  /*创建web3实例对象*/
  public static web3:any;

  /*全局智能合约地址*/
  public static contractAddress:any;

  /*全局智能合约*/
  public static myContract:any;

  /*本地存储设置变量*/
  public static setStorage(key,value) {
    window.localStorage.setItem(key,value);
  }

  /*本地存储获取变量*/
  public static getStorage(key){
    return window.localStorage.getItem(key);
  }

  /*全局智能合约ABI*/
  public static abi:any = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transferable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transferable","type":"bool"}],"name":"setTransferable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupplyCap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_issuer","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

  /*基础环境配置*/
  public static initBasicInfo(){
    if(AppConfig.isDebug){
      /*测试环境*/
      AppConfig.web3 = new Web3("http://35.198.236.251:62335");
      AppConfig.contractAddress = '0x6f3fA66fBf0a33cA2fC42F86695d0197D20dFe20';
    }else {
      /*正式环境*/
      AppConfig.web3 = new Web3("https://mainnet.infura.io/mew");
      AppConfig.contractAddress = '0x5Cf04716BA20127F1E2297AdDCf4B5035000c9eb';
    }
    AppConfig.myContract = new AppConfig.web3.eth.Contract(AppConfig.abi,AppConfig.contractAddress);
  }

  /*查询当前gasPrice*/
  public static curGasPrice:any = 10 * Math.pow(10,9);
  public static getCurrentGasPrice(){
    const gasPriceApi = 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey='+AppConfig.etherApiKey;
    $.ajax({
      url: gasPriceApi,
      type:'GET',
      success:function (data) {
        AppConfig.curGasPrice= parseInt(data.result,16);
        AppConfig.setStorage('curGasPrice',AppConfig.curGasPrice);
      },
      error:function (error) {
        AppConfig.curGasPrice = AppConfig.getStorage('curGasPrice');
        if(!AppConfig.curGasPrice){
          AppConfig.curGasPrice = 10 * Math.pow(10,9);
          AppConfig.setStorage('curGasPrice',AppConfig.curGasPrice);
        }
      }
    })

  }

  /*默认测试钱包*/
  public static walletAccount:any = [];

  /*新建钱包对象*/
  public static newWalletObj:object = {
    imgUrl:'assets/walletIcons/walletIcon'+Math.floor(Math.random()*4+1)+".png",
    walletAddress:'',
    walletName:'NKN Wallet-'+Math.floor(Math.random()*9)+String.fromCharCode(65+ Math.ceil(Math.random() * 25)),
    asset:[
      {
        coinName:'ETH',
        coinNum:'0'
      },
      {
        coinName:'NKN',
        coinNum:'0'
      }
    ],
    keyStore:'',
    passwordTipInfo:'',
    ethTxInfo:[],
    nknTxInfo:[]
  }

  /*默认ETH交易GAS值*/
  public static ethGasValue:number = 25200;

  /*
  * 默认NKN交易GAS值
  * 转账给NKN为空的账户，首次map创建KEY会消耗大量GAS
  * */
  public static nknGasValue:number = 60000;

  /*钱包地址缩略显示*/
  public static walletAddressShorten(add:any,digit:number){
    let addLen:any = add.length;
    let walletShortAddress:any = add.substring(0,digit)+ "..." +add.substring(addLen-12);
    return walletShortAddress;
  }

  /*交易确认次数*/
  public static confirmationNumber:any = 0;

  /* Ethersacn APIKey令牌 */
  public static etherApiKey:any = 'IF4ZIGFW5HZ5JPVGTT3YTBDJPV8KWGK8Y1';

  /* 扫描二维码地址 */
  public static QRcode:any;

  /* 当前设备系统 */
  public static deviceSys:any;

  /* 第一次进入首页标记 */
  public static homeFirst:boolean = true;

  /*
  * 对Date的扩展，将 Date 转化为指定格式的String
  * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  * */
  public static DateFormat(dates,fmt) {
    var o = {
      "M+": dates.getMonth() + 1, //月份
      "d+": dates.getDate(), //日
      "h+": dates.getHours(), //小时
      "m+": dates.getMinutes(), //分
      "s+": dates.getSeconds(), //秒
      "q+": Math.floor((dates.getMonth() + 3) / 3), //季度
      "S": dates.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /* 当前交易信息 */
  public static currentTx:any;

  /* 发送交易状态标记 */
  public static txSend:boolean = false;

  /* 新建交易信息对象 */
  public static newTxObj:object = {
    txHash:'',
    from:'',
    to:'',
    value:'',
    timeStamp:'',
    txDate:'',
    blockNumber:'',
    coinName:'',
    memo:'',
    minerFee:'',
    status:true,
    isConfirmTx:false,
  }

  /* 美元兑人民币汇率默认值 */
  public static UsdToCnyRate:any = 6.8;

  /* 重置新建钱包对象 */
  public static resetNewWalletObj(){
    let tempObj:object = {
      imgUrl:'assets/walletIcons/walletIcon'+Math.floor(Math.random()*4+1)+".png",
      walletAddress:'',
      walletName:'Wallet-'+Math.floor(Math.random()*9)+String.fromCharCode(65+ Math.ceil(Math.random() * 25)),
      asset:[
        {
          coinName:'ETH',
          coinNum:'0'
        },
        {
          coinName:'NKN',
          coinNum:'0'
        }
      ],
      keyStore:'',
      passwordTipInfo:'',
      ethTxInfo:[],
      nknTxInfo:[]
    }
    AppConfig.newWalletObj = tempObj;
    AppConfig.walletAccount = [];
  }

  /* 交易异常标记 */
  public static txError:boolean = false;

  /* 重置交易信息对象 */
  public static resetTxObj(){
    let tempTxObj = {
      txHash:'',
      from:'',
      to:'',
      value:'',
      timeStamp:'',
      txDate:'',
      coinName:'',
      status:true,
      isConfirmTx:false
    }
    AppConfig.newTxObj = tempTxObj;
  }

  /* APP当前版本 */
  public static appVersion:any;

  /* 切换钱包标记 */
  public static isSwitchWallet:boolean = false;

  /* 查询当前NKN价格 */
  public static nknPrice:any = AppConfig.getStorage('nknPrice');
  public static nknPriceApi:any = 'https://openapi.60api.com/openApi/marketApi/ticker?market=nkn_usdt';

  /* 查询当前ETH价格 */
  public static ethUsdPrice:any = AppConfig.getStorage('etherPrice');
  public static ethPriceApi:any = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey='+AppConfig.etherApiKey;
  public static getLastEthPrice(){
    $.ajax({
      url: this.ethPriceApi,
      async:true,
      type:'POST',
      success:function (data) {
        AppConfig.ethUsdPrice = data.result.ethusd;
        AppConfig.setStorage("etherPrice",AppConfig.ethUsdPrice);
      }
    })

    $.ajax({
      url: this.nknPriceApi,
      type:'GET',
      success:function (data) {
        AppConfig.nknPrice = data.ticker.newclinchprice;
        AppConfig.setStorage("nknPrice",AppConfig.nknPrice);
      }
    })

  }

  /* 系统支持语言类型 */
  public static systemLangs:any = [
    { language: "English", type: "en" },
    { language: "简体中文", type: "zh" },
    ];
  /* 系统当前语言 */
  public static systemCurLang:any = AppConfig.getStorage('language');

  /* 获取提示信息各语音版本对象 */
  public static nknTipArray:any;
  public static nknCrrrentTip:any;
  public static getNknTipObject(){
    $.getJSON("assets/js/nknTip.json",function (data) {

      AppConfig.nknTipArray = data;

      switch(AppConfig.systemCurLang){
        case 'zh':
          AppConfig.nknCrrrentTip = AppConfig.nknTipArray[0];
          break;
        case 'en':
          AppConfig.nknCrrrentTip = AppConfig.nknTipArray[1];
          break;
        default:
          AppConfig.nknCrrrentTip = AppConfig.nknTipArray[1];
          break;
      }

    })
  }

}
