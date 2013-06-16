function create (x,y) {
  //attributes
  this.x = x;
  this.y = y;
  this.distance  = {};
  //method
  this.getEncapsulatedCoordinates = getEncapsulatedCoordinates;
}


function getEncapsulatedCoordinates () {
  	var array = [];
  	array[0] = [this.x];
  	array[1] = [this.y];
    return array;
}


exports.create = create;
