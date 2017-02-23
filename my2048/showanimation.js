//显示一个数字的动画
function showNumberWithAnimation(i,j,randNumber){
	var numberCell=$("#number-cell-"+i+"-"+j);

	numberCell.css({
		'background-color':getNumberBackgroundColor(randNumber),
		'color':getNumberColor(randNumber)
	});
	
	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},50);
	numberCell.text(randNumber);
}
//移动动画
function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$("#number-cell-"+fromx+"-"+fromy);
	numberCell.animate({
		left:getPosLeft(tox,toy),
		top:getPosTop(tox,toy)
	},200);
}
//分数改变
function updateScore(score){
	$('#score').text(score);
}











