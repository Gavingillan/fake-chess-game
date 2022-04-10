var board1 = Chessboard('board1', {
    draggable: true,
    sparePieces: false,
    position: 'start',
    onDrop: checkValid,
    showNotation: false
  })

var nextMove = 'w'

const file_num_map = {'a':1,
                    'b':2,
                    'c':3,
                    'd':4,
                    'e':5,
                    'f':6,
                    'g':7,
                    'h':8}


function toBlack(position){
  new_pos = {}
  for(var key in position){
    var value = position[key]
    new_pos[[9-key[0],9-key[2]]] = value
  }
  return new_pos
}

function toNum(position){
  new_pos = {}
  for(var key in position){
    var value = position[key]

    new_pos[[file_num_map[key[0]],key[1]]] = value
  }
  return new_pos
}

function squareToNum(square){
  return [file_num_map[square[0]],square[1]]
}

function squaretoBlack(square){
  return [9-square[0],9-square[1]]
}

function range(start,end){
  if(start > end){
    start_old = start
    end_old = end

    start = end_old
    end = start_old
  }

  let nums = []
  for(var i = start+1;i<end;i++){
    nums.push(i)
  }

  return nums
}


function checkValid(source,target,piece,new_pos,old_pos){
  //source/target letter number 
  //piece b/w & prkbqk
  //newpos/oldpos json for every occupied square
  source = squareToNum(source)
  target = squareToNum(target)

  
  if(piece[0] != nextMove){
    alert('you may only move your own pieces')
    return 'snapback'
  }

  
  /* makes coordinates in old pos into nums to make it easier to work with*/
  old_pos = toNum(old_pos)

  /*flip the board to the perspective of the black player*/
  if(piece[0] == 'b'){
    old_pos = toBlack(old_pos)
    source = squaretoBlack(source)
    target = squaretoBlack(target)
  }

  pieceType = piece[1]

  /*what to do if pawn*/
  if (pieceType == 'P'){
    if (source[0]==target[0] && target[1]-source[1] == 1){
      //if moved one square up make sure that square is empty
      if (target in old_pos){
        return 'snapback'
      }
    }
    else if (source[0]==target[0] && target[1]-source[1] == 2 && source[1] == 2){
      //make sure no pieces in path
      if (target in old_pos || [source[0],source[1]+1] in old_pos){
        return 'snapback'
      }
    }
    else if(Math.abs(source[0]-target[0]) == 1 && target[1]-source[1] == 1){
      //taking diagonally, make sure there is a piece there
      if (!(target in old_pos)){
        return 'snapback'
      }
    }
    else{
      return 'snapback'
    }
  }


  /*what to do if rook*/
  if (pieceType == 'R'){

    console.log("------------Rook Moved---------------")
    console.log(source +' '+ target)

    if(source[0]-target[0]==0 && source[1]-target[1]!=0){  //row doesnt change, col does
      console.log('col changed')

      //make sure there are no pieces in the way
      for(var i of range(parseInt(source[1]),target[1]) ){
        console.log('checking [' + source[0] + ',' + i + ']')
        if ([source[0],i] in old_pos){
          return 'snapback'
        }
      }

      //make sure target doesnt have a piece of the same color
      if (target in old_pos){
        old_piece = old_pos[target]
        console.log(old_piece)
        if (old_piece[0] == nextMove){
          return 'snapback'
        }
      }

    }
    else if(source[0]-target[0]!=0 && source[1]-target[1]==0){ //row changes
      console.log('row changed')
      //make sure there are no pieces in the way
      for(var i of range(parseInt(source[0]),target[0]) ){
        console.log('checking [' + i + ',' + source[1] + ']')
        if ([i,source[1]] in old_pos){
          return 'snapback'
        }
      }
      
      if (target in old_pos){
        old_piece = old_pos[target]
        console.log(old_piece)
        if (old_piece[0] == nextMove){
          return 'snapback'
        }
      }
    }
    else{ //both or neither true - invalid move
      return 'snapback'
    }

  }

  /*what to do if knight*/
  if (pieceType == 'N'){
    console.log("knight moved")

    if (Math.abs(parseInt(source[0])-parseInt(target[0])) == 2){ //moves two up or down
      if (Math.abs(parseInt(source[1])-parseInt(target[1])) == 1){ // make sure its up/down two -> over 1
        //make sure you dont own that piece
        // if (target in old_pos){
        //   old_piece = old_pos[target]
        //   console.log(old_piece)
        //   if (old_piece[0] == nextMove){
        //     return 'snapback'
        //   }
        // }
      }else{
        return 'snapback'
      }
    }
    else if(Math.abs(parseInt(source[0])-parseInt(target[0])) == 1){
      if (Math.abs(parseInt(source[1])-parseInt(target[1])) == 2){ // make sure its up/down one -> over 2
        //make sure you dont own that piece
        // if (target in old_pos){
        //   old_piece = old_pos[target]
        //   console.log(old_piece)
        //   if (old_piece[0] == nextMove){
        //     return 'snapback'
        //   }
        // }
      }else{
        return 'snapback'
      }
    }
    else{
      return 'snapback'
    }


  }

  /*what to do if bishop*/
  if (pieceType == 'B'){
    if (Math.abs(parseInt(source[0]) - parseInt(target[0]) ) == Math.abs(parseInt(source[1]) - parseInt(target[1])) ){
      //make sure no other pieces in path


      x = range(0,target[0]-source[0])
      y = range(0,target[1]-source[1])

      if(Math.abs(x[0]!= 1)){
        x.reverse()
      }
      if(Math.abs(y[0]!= 1)){
        x.reverse()
      }

      for(var i = 0;i<x.length;i++){

        if ([ parseInt(source[0])+x[i], parseInt(source[1])+ y[i]] in old_pos){
          return 'snapback'
        }
      }
      
      //make sure you dont own that piece
      // if (target in old_pos){
      //   old_piece = old_pos[target]
      //   console.log(old_piece)
      //   if (old_piece[0] == nextMove){
      //     return 'snapback'
      //   }
      // }
    }
    else{
      return 'snapback'
    }
  }
  
  /*what to do if queen*/
  if (pieceType == "Q"){
    if (Math.abs(parseInt(source[0]) - parseInt(target[0]) ) == Math.abs(parseInt(source[1]) - parseInt(target[1])) ){ //diagonal move
      //make sure no other pieces in path


      x = range(0,target[0]-source[0])
      y = range(0,target[1]-source[1])

      if(Math.abs(x[0]!= 1)){
        x.reverse()
      }
      if(Math.abs(y[0]!= 1)){
        x.reverse()
      }

      for(var i = 0;i<x.length;i++){

        if ([ parseInt(source[0])+x[i], parseInt(source[1])+ y[i]] in old_pos){
          return 'snapback'
        }
      }
      
      //make sure you dont own that piece
      // if (target in old_pos){
      //   old_piece = old_pos[target]
      //   console.log(old_piece)
      //   if (old_piece[0] == nextMove){
      //     return 'snapback'
      //   }
      // }
    }
    else if(source[0]-target[0]==0 && source[1]-target[1]!=0){  //row doesnt change, col does
      console.log('col changed')

      //make sure there are no pieces in the way
      for(var i of range(parseInt(source[1]),target[1]) ){
        console.log('checking [' + source[0] + ',' + i + ']')
        if ([source[0],i] in old_pos){
          return 'snapback'
        }
      }

      //make sure target doesnt have a piece of the same color
      // if (target in old_pos){
      //   old_piece = old_pos[target]
      //   console.log(old_piece)
      //   if (old_piece[0] == nextMove){
      //     return 'snapback'
      //   }
      // }

    }
    else if(source[0]-target[0]!=0 && source[1]-target[1]==0){ //row changes
      console.log('row changed')
      //make sure there are no pieces in the way
      for(var i of range(parseInt(source[0]),target[0]) ){
        console.log('checking [' + i + ',' + source[1] + ']')
        if ([i,source[1]] in old_pos){
          return 'snapback'
        }
      }
      
      // if (target in old_pos){
      //   old_piece = old_pos[target]
      //   console.log(old_piece)
      //   if (old_piece[0] == nextMove){
      //     return 'snapback'
      //   }
      // }
    }
    else{ //both or neither true - invalid move
      return 'snapback'
    }
  }

  /*what to do if King*/
  if(pieceType == "K"){
    if(Math.abs(parseInt(target[0])-parseInt(source[0])) <= 1 && Math.abs(parseInt(target[1])-parseInt(source[1])) <= 1 && target!=source){
      //make sure you dont own that piece
      // if (target in old_pos){
      //   old_piece = old_pos[target]
      //   console.log(old_piece)
      //   if (old_piece[0] == nextMove){
      //     return 'snapback'
      //   }
      // }
    }
    else{
      return 'snapback'
    }
  }


  if(nextMove == 'w'){
    nextMove = 'b'
  }else{
    nextMove = 'w'
  }
}