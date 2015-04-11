'use strict';

var current = 'smith';

var $selected;

var enemy;

$(document).ready(init);



function init(){

  initBoard();

  switchBoard();



  // only allow active clas to be clicked

  $('#board').on('click', '.active', select);

  $('#board').on('click', '.empty', drop);

}



function select(){

  $selected = $(this);

  $('.valid').removeClass('selected');

  $selected.addClass('selected');

}



function drop(){



  if (!$selected) {

    return;

  }



  var $target = $(this);

  // bool to check if selected is king

  var isKing = $selected.is('.king');



  var src = {};

  var tgt = {};



  src.x = $selected.data('x') * 1;

  src.y = $selected.data('y') * 1;

  tgt.x = $target.data('x') * 1;

  tgt.y = $target.data('y') * 1;



  // directional commands

  var compass = {};

  compass.north = (current === 'js') ? -1 : 1;

  compass.east = (current === 'js') ? 1 : 1;

  compass.west = compass.east * -1;

  compass.south = compass.north * -1;



  switch(moveType(src, tgt, compass, isKing)){

    case 'move':

      //console.log('move');

      switchBoard();

      movePiece($selected, $target);

      break;

    case 'jump':

      //console.log('jump');

      switchBoard();

      movePiece($selected, $target);

  }

}



function movePiece($selected, $target){

  var targetClasses = $target.attr('class');

  var selectedClasses = $selected.attr('class');



  $target.attr('class', selectedClasses);

  $selected.attr('class', targetClasses);

}



function moveType(src, tgt, compass, isKing){



  if (isMove(src, tgt, compass, isKing)){

    return 'move';

  }



  if (isJump(src, tgt, compass, isKing) && isEnemy(src, tgt, compass, isKing)){

    return 'jump';

  }

}



function initBoard(){

  $('#board tr:lt(3) .valid').addClass('neo player');

  $('#board tr:gt(4) .valid').addClass('smith player');

  $('td.valid:not(.player)').addClass('empty');

}



function isMove(src, tgt, compass, isKing){

  // if tgt is left o right, north or south, is a king and  can go south

  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y) || (src.y + compass.south === tgt.y) || (isKing && src.y + compass.south === tgt.y);

}



function isJump(src, tgt, compass, isKing){

  // fix

  return (src.x + (compass.east * 2) === tgt.x || src.x + (compass.west * 2) === tgt.x) && (src.y + (compass.north * 2) === tgt.y) || (src.y + (compass.south * 2) === tgt.y) || (isKing && src.y + (compass.south * 2) === tgt.y);

}



function isEnemy(src, tgt, compass, isKing){

  //console.log(src, tgt);
  enemy = (current === 'neo') ? 'smith' : 'neo';
  $('.valid').removeClass('enemy');
  $('.' + current).addClass('enemy');




  var checkX = (src.x + tgt.x) / 2;
  checkX = checkX.toString();

  var checkY = (src.y + tgt.y) / 2;
    checkY = checkY.toString();
    console.log(checkX, checkY);
    //$('td[data-x='+checkX+'][data-y='+checkY+']')
    var $middle = $('td[data-x='+checkX+'][data-y='+checkY+']');
    $middle.removeClass().addClass('valid', 'empty');
  //var middle = $('td').data('x', checkX).data('y', checkY);
    //$('[data-x = ' + checkX + '] [data-y = ' + checkY + ']').removeClass().addClass('valid', 'empty');
    //console.log($middle);
  if ($middle.hasClass('enemy')){
    //var enemy = !(current)
    //$('.' + !current)
    // middle.removeClass().addClass('valid', 'empty');
    //middle.addClass('empty').removeClass('neo', 'smith', 'active', 'player');
    $('[data-x = ' + checkX + '] [data-y = ' + checkY + ']').removeClass().addClass('valid', 'empty');
    movePiece($selected, $target);
    return true;

  }

  return false;

  }





function switchBoard(){

  current = (current === 'neo') ? 'smith' : 'neo';

  $('.valid').removeClass('active selected').addClass('inactive');

  $('.' + current).addClass('active');

}
