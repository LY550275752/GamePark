var board=new Array();
var score=0;
//保存格子是否发生过碰撞
var hasConflicted=new Array();
//保存触控起始，结束坐标值
var startX,startY,endX,endY;
$(document).ready(function(){
	newGame();
})

function newGame(){
	//为移动端初始化宽度
	prepareForMobile();
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}
function prepareForMobile(){
	//判断屏幕大小是不是够小
	if(documentWidth>800){
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}

	$('#grid-container').css({
		'width':gridContainerWidth-2*cellSpace,
		'height':gridContainerWidth-2*cellSpace,
		'padding':cellSpace,
		'border-radius':0.02*gridContainerWidth
	});
	$('.grid-cell').css({
		'width':cellSideLength,
		'height':cellSideLength,
		'border-radius':0.06*cellSideLength
	})
}
function init(){
	//棋盘
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css({
				"top":getPosTop(i,j),
				"left":getPosLeft(i,j)
			});
		}
	}
	//初始化board数组
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			hasConflicted[i][j]=false;
			board[i][j]=0;

		}
	}
	//有操作
	updateBoardView();

	score=0;
	$("#score").text(score);
}
//更新棋盘上显示的方块
function updateBoardView(){
	//如果有number-cell后先删除
	$(".number-cell").remove();
	//遍历格子，改变样式
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
			var theNumberCell=$("#number-cell-"+i+"-"+j);

			if(board[i][j]==0){
				theNumberCell.css({
					"width":"0px",
					"height":"0px",
					"top":getPosTop(i,j)+cellSideLength/2,/*这里是为了把它放中间，动画才好看*/
					"left":getPosLeft(i,j)+cellSideLength/2
				});
			}else{
				theNumberCell.css({
					"width":cellSideLength,
					"height":cellSideLength,
					"top":getPosTop(i,j),
					"left":getPosLeft(i,j),
					"background-color":getNumberBackgroundColor(board[i][j]),
					"color":getNumberColor(board[i][j])
				});
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
		$('.number-cell').css({
			'line-height':cellSideLength+'px',
			'font-size':0.6*cellSideLength+'px'
		})
	}

}
//棋盘上生成一个数字
function generateOneNumber(){
	//先看有无空格
	if(nospace(board)){
		return false;
	}
	//随机生成一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	//看是不是空格
	//优化随机
	var times=0;
	while(times<50){
		if(board[randx][randy]==0){
			break;
		}
		//重复
		var randx=parseInt(Math.floor(Math.random()*4));
		var randy=parseInt(Math.floor(Math.random()*4));

		times++;
	}
	if(times==50){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
				}
			}
		}
	}
	//随机生成2或4
	var randNumber=Math.random()<0.65?2:4;

	//在位置上显示,更新格子数组
	
	showNumberWithAnimation(randx,randy,randNumber);
	board[randx][randy]=randNumber;	
}
//键盘敲下事件
$(document).keydown(function (event){
	//event.preventDefault();//禁止事件的默认动作
	switch(event.keyCode){
		case 37: //left
			//一定要能移动才给新生成数字
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38: //up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39: //right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40: //down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
	}
});

//监听移动端触控事件
document.addEventListener('touchstart',function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
	event.preventDefault();
})
document.addEventListener('touchend',function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;
	//存差值
	var deltaX=endX-startX;
	var deltaY=endY-startY;

	if(Math.abs(deltaX)<0.15*documentWidth&&Math.abs(deltaY)<0.15*documentWidth){
		return;
	}
	//判断X轴还是Y轴
	if(Math.abs(deltaX)>Math.abs(deltaY)){
		//X
		if(deltaX>0){
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}else{
		//Y
		if(deltaY>0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//move up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}

})
//左移函数
function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}

	//遍历右边12个格子
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				//有数字则遍历左边
				for(var k=0;k<j;k++){
					//看落点是否为空且路上有无障碍
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						//更新
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//更新
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//分数增加
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
						
						continue;
					}
				}
			}
		}
	}
	//遍历完后更新格子显示状态,慢一点才能显示动画
	setTimeout("updateBoardView()",200);
	return true;
}
//右移函数
function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}

	//遍历左边12个格子
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				//有数字则遍历右边
				for(var k=3;k>j;k--){
					//看落点是否为空且路上有无障碍
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						//更新
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]*=2;
						//更新
						board[i][j]=0;
						//分数增加
						 score += board[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	//遍历完后更新格子显示状态,慢一点才能显示动画
	setTimeout("updateBoardView()",200);
	return true;
}
//上移函数
function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	//遍历下面12个格子
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
						showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //分数增加
                        score += board[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
                        continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//下移函数
function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}

	//遍历上面12个格子
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]*=2;
						board[i][j]=0;
						//分数增加
						score+=board[k][j];
						updateScore(score);

						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//游戏结束判断
function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}
function gameover(){
	alert('啊啊啊，死了');
}