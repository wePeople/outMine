/*
数字0~9，
0：空;
9：雷
*/

$(function(){
var tt=getCookie('mineStyle');
cStyle(Number(tt));
init();
});

function restart(){
init();
}

//初始变量
//l1=16;l2=16;
//num9=40;
l1=30;l2=16;//行列
num9=99;//雷总数
var cav=new Array();
var fliped=new Array();
sum=l1*l2;
inGame = 0; //游戏状态，0为结束，1为进行中，2为初始化完毕但未开始 
startTime=0; //开始时间
firstPoint=0;//第一次点击 0为没点过，1为已经点过了

//雷区初始化
function init(){
for(i=0;i<sum;i++){
fliped[i]=0;//有01两个值。0是没翻过
cav[i]=0;}
$('#cTime').attr('value',0); 
inGame = 2;
firstPoint=0;

//布雷 随机
num9_c=0;
while(num9_c<num9){
newM=Math.ceil(Math.random()*sum);
if(cav[newM]==0) {cav[newM]=9;num9_c++;}
}

html='';
for(i=0;i<sum;i++) cav[i]=count(cav,i);

for(i=0;i<sum;i++){
//html+='<div class="box" n="'+i+'">'+cav[i]+'</div>';
html+='<div class="box" n="'+i+'"></div>';
if((i+1)%l1==0) html+='<br>';
}

$('#container').html(html);

//点击事件
$('.box').click(function(){
if(firstPoint==0){
firstPoint=1;
inGame = 1;
var now = new Date(); 
startTime = now.getTime(); 
timer();
}

n=Number($(this).attr('n'));

if(cav[n]==9) {inGame = 0;showMine();again(0);}
else{
if(!(n<0&&n>sum)){
openCard(n);
if(ckWin()){inGame = 0;showMine(1);again(1);}
}
}})
}

//根据雷判断某块的数字
function count(array,n){
newN=0;
if(array[n]==9) return 9;
if(n<0||n>array.length) return 10;

ifleft=n%l1!=0;
ifright=(n+1)%l1!=0;

if(ifleft&&n-l1>-2&&array[n-l1-1]==9) newN++;
if(n-l1>-1&&array[n-l1]==9) newN++;
if(ifright&&n-l1>0&&array[n-l1+1]==9) newN++;

if(ifleft&&n>0&&array[n-1]==9) newN++;
if(ifright&&n+1<sum&&array[n+1]==9) newN++;

if(ifleft&&n+l1-1<sum&&array[n+l1-1]==9) newN++;
if(n+l1<sum&&array[n+l1]==9) newN++;
if(ifright&&n+l1+1<sum&&array[n+l1+1]==9) newN++;

if(newN>9) alert('newN:'+newN);
return newN;
}

function showMine(type){
var type=arguments[0]?arguments[0]:0;//设置默认参数
type=Number(type);

html='';
cla='bg_over';
//输了
if(type==1) cla='bg_a';

for(i=0;i<sum;i++){
if(cav[i]==9) html+='<div class="'+cla+'"></div>';
else{
cc="blue";
if(cav[i]==1||cav[i]==2) cc="green";
else if(cav[i]==6||cav[i]==7||cav[i]==8) cc="red";
html+='<div class="bg '+cc+'">'+
(cav[i]==0?'':cav[i]+'')
+'</div>';
}
if((i+1)%l1==0) html+='<br>';
}

$('#container').html(html);
}

function ckWin(){
leftBlock=sum;
for(i=0;i<sum;i++){if(fliped[i]==1) leftBlock--;}
return leftBlock==num9;
}

//------------------------------------------------

//翻牌 DFS
function openCard(n){
if(cav[n]==9){}
else if(cav[n]==0){
$('.box[n="'+n+'"]').attr('class','bg');
fliped[n]=1;

//上右下左
tag1=false;tag3=false;

if(n-l1>-1)//上
{
if(fliped[n-l1]==0) openCard(n-l1);
if(fliped[n-l1]==1) tag1=true;
}
if(n+l1<sum)//下
{
if(fliped[n+l1]==0) openCard(n+l1);
if(fliped[n+l1]==1) tag3=true;
}
if((n%l1!=0)&&n>0)//左
{
if(fliped[n-1]==0) openCard(n-1);
if(tag1&&fliped[n-l1-1]==0) openCard(n-l1-1);//左上
if(tag3&&fliped[n+l1-1]==0) openCard(n+l1-1);//左下
}
if(((n+1)%l1!=0)&&(n+1<sum))//右
{
if(fliped[n+1]==0) openCard(n+1);
if(tag1&&fliped[n-l1+1]==0) openCard(n-l1+1);//右上
if(tag3&&fliped[n+l1+1]==0) openCard(n+l1+1);//右下
}

}
else{
cc="blue";
if(cav[n]==1||cav[n]==2) cc="green";
else if(cav[n]==6||cav[n]==7||cav[n]==8) cc="red";
$('.box[n="'+n+'"]').attr('class','bg').addClass(cc).html(cav[n]);
fliped[n]=1;
}
}


//时钟---------------------------------------
function timer(){ 
if(inGame == 1) { //只在游戏进行中计时 
var now = new Date(), 
ms = now.getTime(); 
cValue=Math.ceil((ms - startTime) / 1000);
if(cValue<1000){
$('#cTime').attr('value',cValue); 
setTimeout(function() { timer(); }, 500); 
}
} else if(inGame == 2) { 
$('#cTime').attr('value',0); 
} 
}

//弹窗-------------------------------------
//网上下载的easydialog (来源：stylechen.com　作者：雨夜带刀　代码整理：H-ui)
function again(type){
type=Number(type);
var btnFn = function(){
  init();
  return true;//关闭遮罩
};

easyDialog.open({
  container : {
    header : type==0?'Failure':'Win!',
    content : type==0?'<h1>You lose!</h1>':'<h1>Congratulation!</h1>',
    yesText:'Again',
    yesFn : btnFn
  }
});
}

//换调色方案---------------------------------
function c_css(){
var btnFn = function(){
  init();
  return true;//关闭遮罩
};

easyDialog.open({
  container : {
    header : 'Change the Style',
    content : '<input class="bgblue" type="button" onclick="cStyle(1)" value="Blue"/><input class="pink" type="button" onclick="cStyle(2)" value="Pink"/>'
  },
  overlay : false//没有遮罩
});
}

function cStyle(type){
type=Number(type);
if(type==2){
$('#ccss').attr('href','css/style_pink.css');
}else $('#ccss').attr('href','css/style.css');

setCookie('mineStyle',type);
}


//---------------------------------------
//JS操作cookies方法!
//写cookies
function setCookie(name,value)
{
var Days = 30;
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);//30day
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}