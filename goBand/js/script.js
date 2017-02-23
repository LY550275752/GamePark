var chess=document.getElementById('chess');
var context=chess.getContext('2d');

//定义一个黑白棋判断，一个数组存储棋盘情况
var me=true;
var chessBox=[];
//初始化棋盘数组
for(var i=0;i<15;i++){
	chessBox[i]=[];
	for(var j=0;j<15;j++){
		chessBox[i][j]=0;
	}
}

//定义赢法数组
var wins=[];
//初始化
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}

//定义赢法统计数组还有结束标志
var myWin=[],
	computerWin=[],
	over=false;

//填充赢法数组,count记录多少种赢法
var count=0;
 //先是统计竖着的赢法
for(var i=0;i<15;i++){
 	//注意这里的j只能到11，因为是五颗棋子
 	for(var j=0;j<11;j++){
 		for(var k=0;k<5;k++){
 			wins[i][j+k][count]=true;
 		}
 	//赢法加1
 	count++;
 	}
}

 //统计横着的赢法
for(var i=0;i<15;i++){
 	//注意这里的j只能到11，因为是五颗棋子
 	for(var j=0;j<11;j++){
 		for(var k=0;k<5;k++){
 			wins[j+k][i][count]=true;
 		}
 	//赢法加1
 	count++;
 	}
}
 //统计斜着的赢法
for(var i=0;i<11;i++){
 	//注意这里的j只能到11，因为是五颗棋子
 	for(var j=0;j<11;j++){
 		for(var k=0;k<5;k++){
 			wins[i+k][j+k][count]=true;
 		}
 	//赢法加1
 	count++;
 	}
}
 //统计斜着的赢法
for(var i=0;i<11;i++){
 	//注意这里的j只能到11，因为是五颗棋子
 	for(var j=14;j>3;j--){
 		for(var k=0;k<5;k++){
 			wins[i+k][j-k][count]=true;
 		}
 	//赢法加1
 	count++;
 	}
}

//以count为维度，把myWin和computerWin初始化
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

//画棋盘
context.strokestyle='#BFBFBF';
var logo=new Image();
logo.src="images/tencent.png";
logo.onload=function(){
	context.drawImage(logo,125,125,200,200);
	drawChessBoard();
}

//给棋盘绑定点击函数
chess.onclick=function(e){
	//先判断游戏有无结束
	if(over){
		return;
	}
	//如果不是我方下棋，直接返回
	if(!me){
		return;
	}
	var x=e.offsetX,
		y=e.offsetY;
	var i=Math.floor(x/30),
		j=Math.floor(y/30);
	if(chessBox[i][j]==0){
		oneStep(i,j,me);
		chessBox[i][j]=1;
		//落子完，开始做赢法统计
		for(var k=0;k<count;k++){
			//此事的i,j下的第K种赢法如果为true
			if(wins[i][j][k]){
				myWin[k]++;//我方这种赢法完成度加1
				computerWin[k]=6;//电脑方这种赢法已经不可能了，设为异常值
				//再判断第k种赢法的完成度
				if(myWin[k]==5){
					//胜利，结束
					window.alert("牛逼啊，居然赢了");
					over=true;
				}
			}
		}
		if(!over){
			me=!me;
			computerAI();
		}
	}
}
//画棋盘函数
var drawChessBoard=function(){
	for(var i=0;i<15;i++){
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
	}
	context.stroke();
}
//走一步的函数
var oneStep=function(i,j,me){
	context.beginPath(); //创建路径
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI); //画弧度
	context.closePath();	//关闭路径

	//创建一个渐变对象，先是画两个圆
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30+2,13,15+i*30-3,15+j*30-3,0);
	if(me){
		gradient.addColorStop(0,'#0A0A0A');
		gradient.addColorStop(1,'#636766');
	}else{
		gradient.addColorStop(0,'#D1D1D1');
		gradient.addColorStop(1,'#F9F9F9');
	}
	//填充
	context.fillStyle=gradient;
	context.fill();
}
//机器方下棋
var computerAI=function(){
	//定义两个二维数组，用来衡量一个点的价值
	//myScore是阻止我的权值
	//computerScore是自己赢的权值
	var myScore=[],
		computerScore=[];
	//存储最大权值和这个点的坐标
	var max=0,u=0,v=0;
	//初始化两个数组
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}

	//！！！这里高能预警！！！
	//遍历棋盘,计算分数
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			//判断一下是否空闲
			if(chessBox[i][j]==0){
				//发现居然没落子，赶紧遍历所有赢法
				for(var k=0;k<count;k++){
					//第k种赢法下，这个点有没价值先
					if(wins[i][j][k]){
						//根据赢法，开始计算此点积分
						//阻止我赢的分数
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						//让自己赢的分数
						if(computerWin[k]==1){
							computerScore[i][j]+=210;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=20000;
						}
					}
				}
				//所有赢法遍历完成后看这个点的分数
				//注意这里的阻止我赢优先
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					//既然一样，那就看看哪个能让自己赢
					if(computerScore[i][j]){
						u=i;
						v=j;
					}
				}
				//再看看能让自己赢的分数
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBox[u][v]=2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k]=6;
			if(computerWin[k]==5){
				window.alert("你个垃圾，连电脑都输");
				over=true;
			}
		}
	}
	if(!over){
		me=!me;
	}
}