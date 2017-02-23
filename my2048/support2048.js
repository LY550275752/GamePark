//获取设备可使用的宽度，初始化
documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;


function getPosTop(i,j){
	var top=cellSpace+i*(cellSideLength+cellSpace);
	return top;
}
function getPosLeft(i,j){
	var left=cellSpace+j*(cellSideLength+cellSpace);
	return left;
}
function getNumberBackgroundColor(number){
	var color="black";
	switch(number){
		case 2:
			color='#eee4da';
			break;
		case 4:
			color="#ede0c8";
			break;
    	case 8:
			color='#f2b179';
			break;
		case 16:
			color="#f59563";
			break;
		case 32:
			color='#f67c5f';
			break;
		case 64:
			color="#f65e3b";
			break;
		case 128:
			color='#edcf72';
			break;
		case 256:
			color="#edcc61";
			break;
		case 512:
			color='#9c0';
			break;
		case 1024:
			color="#33b5e5";
			break;
		case 2048:
			color='#09c';
			break;
	}
	return color;
}
function getNumberColor(number){
	if(number<=4){
		return "#776e50";
	}
	return "white";
}
//检测棋盘还有无空格
function nospace(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]==0){
				return false;
			}
		}
	}
	return true;
}

//检测能否左移
function canMoveLeft(board){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!= 0){
				if(board[i][j-1]==0||board[i][j-1]==board[i][j])
					return true;
			}
		}
	}
	return false;
}
//检测能否上移
function canMoveUp(board){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				if(board[i-1][j]==0||board[i][j]==board[i-1][j])
					return true;
			}
		}
	}
	return false;
}
//检测能否右移
function canMoveRight(board){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				if(board[i][j+1]==0||board[i][j+1]==board[i][j])
					return true;
			}
		}
	}
	return false;
}
//检测能否下移
function canMoveDown(board){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				if(board[i+1][j]==0||board[i+1][j]==board[i][j])
					return true;
			}
		}
	}
	return false;
}
//检测行上有无阻碍
function noBlockHorizontal(row,col1,col2,board){
	for(var i=col1+1;i<col2;i++){
		if(board[row][i]!=0)
			return false;
	}
	return true;
}
//检测列上有无障碍
function noBlockVertical(col,row1,row2,board){
	for(var i=row1+1;i<row2;i++){
		if(board[i][col]!=0)
			return false;
	}
	return true;
}
//检测是否还能移动
function nomove(board){
	if(	canMoveLeft(board)||
		canMoveRight(board)||
		canMoveUp(board)||
		canMoveDown(board))
		return false;

	return true;
}