'use strict';

$(document).ready(init);

var current ='smith';
var $source;
var $target;

function init(){
  initBoard();
  switchUser();
  $('table').on('click','.active',select);
  $('table').on('click','.empty', move);
  $('button').on('click',initBoard());
}

function move(){
  if(!$source){
    return;
  }
  $target = $(this);
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  var compass = {};
  compass.north = (current === 'smith') ? -1 : 1;
  compass.east = (current === 'smith') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src,tgt,compass,isKing)){
    case 'move':
      movePiece($target,$source);
      switchUser();
      break;
    case 'jump':

      movePiece($source, $target);
      killMan(src,tgt,compass,isKing);
        $source = $target;

        // dblJumpBool = true;

        src.x = $source.data('x') * 1;
        src.y = $source.data('y') * 1;

        // code to check if double jump possible
        $('td').each(function(e){
          if ($(this).data('y') === src.y + (compass.north * 2) && ($(this).data('x') === src.x + (compass.east * 2) || $(this).data('x') === src.x + (compass.west * 2))){
            $target = $(this)[0];

            console.log($target);

            if ($($target).hasClass('empty')){

               var enemy = (current === 'chrome') ? 'chrome' : 'firefox';
              $('.valid').removeClass('enemy');
              $('.' + current).addClass('enemy');

              tgt.x = $($target).data('x');
              tgt.y = $($target).data('y');

              var checkX = ((src.x + tgt.x) / 2);
              var checkY = ((src.y + tgt.y) / 2);
              var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
              $middle = $middle[0];
              $middle.addClass('enemy');

              if ($($middle).hasClass('enemy player')){
                switchUser();
              }

            }
          }
        });

        switchUser();
      }
    }


function killMan(src,tgt,compass,isKing){
  console.log('kill activated');
  var $middle = inMiddle(src,tgt,compass,isKing);
  $($middle).removeClass().addClass('valid empty');

}

function movePiece($target,$source){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);

  $target.data('y') === 0 ? $target.addClass('king smithKing') : console.log('shit monkey');
  $target.data('y') === 7 ? $target.addClass('king neoKinged') : console.log('shit monkey');

}

function moveType(src,tgt,compass,isKing){
  if (isJump(src,tgt,compass,isKing) && isEnemy(inMiddle(src,tgt,compass,isKing))){
    return 'jump';
  }
  if(isMove(src,tgt,compass,isKing)){
    return 'move';
  }
}

function isMove(src,tgt,compass,isKing){
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing){

  var checkEast = compass.east * 2;
  var checkWest = compass.west * 2;
  var checkNorth = compass.north * 2;
  var compassSouth = compass.south * 2;

  return (src.x + checkEast === tgt.x || src.x + checkWest === tgt.x) && (src.y + checkNorth === tgt.y) || (src.y + compassSouth === tgt.y) || (isKing && src.y + compassSouth === tgt.y);
}

function isEnemy($middle){
  if ($($middle).hasClass('neo')&&($($source).hasClass('smith')) || ($($middle).hasClass('smith') && $($source).hasClass('neo'))){
    return true;
  } else if ($($middle).hasClass('neoKinged')&&($($source).hasClass('smithKing')) || ($($middle).hasClass('smithKing') && $($source).hasClass('neoKinged'))){
    return true;
  } else if ($($middle).hasClass('neo')&&($($source).hasClass('smithKing')) || ($($middle).hasClass('smith') && $($source).hasClass('neoKinged'))){
    return true;
  } else if ($($middle).hasClass('neoKinged')&&($($source).hasClass('smith')) || ($($middle).hasClass('smithKing') && $($source).hasClass('neo'))){
    return true;
  } else {
    return false;
  }
}

function inMiddle(src, tgt,compass, isKing){
  var checkX = (src.x + tgt.x) / 2;
  var checkY = (src.y + tgt.y) / 2;
  var $middle = ($('td[data-x='+checkX+']td[data-y='+checkY+']'));
  $middle = $middle[0];
  return $middle;
}

function select(){
  $source = $(this);
  $('.valid').removeClass('selected');
  $source.addClass('selected');
}

function isKing(){
  return $source.hasClass('king');
}

function initBoard(){
  $('tbody tr:lt(3) .valid').addClass('player neo');
  $('tbody tr:gt(4) .valid').addClass('player smith');
  $('tbody tr:lt(5):gt(2) .valid').addClass('empty');
}

function switchUser(){
  current = (current === 'neo') ? 'smith' : 'neo';
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
}
