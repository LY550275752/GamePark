window.onload=function (){
	reset();
}
//保存定时时间
var time=0;
//暂停标志，true表示暂停
var pause=true;
//设置定时器
var set_timer;
//保存大的div当前的小div编号
var d=new Array(10);
//保存大的div有几个方向可以走
var d_direct=new Array(
	[0],//第一个不用，为了便于理解
	[2,4],
	[1,3,5],
	[2,6],
	[1,5,7],
	[2,4,6,8],
	[3,5,9],
	[4,8],
	[5,7,9],
	[6,8]
);
//大div可移动编号的位置,[left,top]
var d_posXY=new Array(
	[0],//不用第一个
	[0,0],
	[150,0],
	[300,0],
	[0,150],
	[150,150],
	[300,150],
	[0,300],
	[150,300],
	[300,300]
);
//大DIV编号的位置
d[1]=1;d[2]=2;d[3]=3;d[4]=4;d[5]=5;d[6]=6;d[7]=7;d[8]=8;d[9]=0;
//默认按照顺序，都九块为0

//移动函数
function move(id){
	if(pause){
		start();
	}
	//获取小div在哪个大div
	for(var i=1;i<10;++i){
		if(d[i]==id)
			break;
	}
	console.log(i);
	//小div可以去的div
	var target_d=0;
	//这个函数用来得到能去的div
	target_d=whereCanTo(i);//返回0是不可以移动
	console.log(target_d);
	if(target_d!=0){
		//把当前和目标的大div中装的编号更新
		d[i]=0;
		d[target_d]=id;
		//开始移动，定位
		document.getElementById("d"+id).style.left=d_posXY[target_d][0]+"px";
		document.getElementById("d"+id).style.top=d_posXY[target_d][1]+"px";
	}
	//移动完成，检测是否全部完成游戏
	var finish_flag=true;//true表示完成
	for(var k=1;k<9;k++){
		//一个不对就判断，跳出
		if(d[k]!=k){
			finish_flag=false;
			break;
		}

	}
	//游戏完成则暂停，跳出
	if(finish_flag==true){
		if(!pause)
			start();//暂停或开始，同一个函数
		alert("恭喜你，完成了")
	}
}

//找出能去那个大div的编号
function whereCanTo(cur_div){
	var j=0;
	//不能移动的标志
	var move_flag=false;
	for(j=0;j<d_direct[cur_div].length;++j){
		//把能去的遍历,有0则可以去，标志，跳出
		if(d[d_direct[cur_div][j]]==0){
			move_flag=true;
			break;
		}
	}
	if(move_flag==true){
		return d_direct[cur_div][j];
	}else{
		return 0;//不可以移动
	}

}
//开始暂停函数
function start(){
	//状态为暂停
	if(pause){
		document.getElementById("start").innerHTML="暂停";
		pause=false;//状态改为未暂停
		set_timer=setInterval(timer,1000);//启动定时
	}else{
		//如果是开始
		document.getElementById("start").innerHTML="开始";
		pause=true;//状态改为暂停
		clearInterval(set_timer);//清除定时
	}
}
//定时函数,给定时器执行的
function timer(){
	time+=1;//一秒钟加1
	var min=parseInt(time/60);//取分钟
	var sec=time%60;//取秒
	document.getElementById("timer").innerHTML=min+"分"+sec+"秒";//显示
}

//重置函数，也算是初始化函数
function reset(){
	time=0;//把时间设为0
	//random_d();//打乱方块
	random_click();
}
function random_d(){
	for(var i=9;i>1;--i){
		var to=parseInt(Math.random()*(i-1)+1)//随机数，1到i
		//当前的div移到随机的那个
		if(d[i]!=0){
			document.getElementById("d"+d[i]).style.left=d_posXY[to][0]+"px";
			document.getElementById("d"+d[i]).style.top=d_posXY[to][1]+"px";

		}
		//随机的那个移到当前
		if(d[to]!=0){
			document.getElementById("d"+d[to]).style.left=d_posXY[i][0]+"px";
			document.getElementById("d"+d[to]).style.top=d_posXY[i][1]+"px";			
		}
		var tem=d[to];
		d[to]=d[i];
		d[i]=tem;
		//换编号
	}
}
function random_click(){
	for(var s=1;s<80;s++){
		var i=1;
		//获取小div在哪个大div
		var choose=parseInt(Math.random()*8+1)//随机数，1到i
		for(i=1;i<10;++i){
			if(d[i]==choose)
				break;
		}
		//小div可以去的div
		var target_d=0;
		//这个函数用来得到能去的div
		target_d=whereCanTo(i);//返回0是不可以移动
		if(target_d!=0){
			//把当前和目标的大div中装的编号更新
			d[i]=0;
			d[target_d]=choose;
			//开始移动，定位
		}
	}
	console.log(d)
	//d全部更新完
	for(var come=1;come<=9;come++){
		if(d[come]!=0){
			document.getElementById("d"+d[come]).style.left=d_posXY[come][0]+"px";
			document.getElementById("d"+d[come]).style.top=d_posXY[come][1]+"px";
		}
	}
}
