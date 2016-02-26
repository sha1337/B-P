Math.TAU = Math.PI *2; // Might be usefull
Math.randomFloat = function(a,b){ // random number in [a,b)
	var min = Math.min(a,b);
	var max = Math.max(a,b);
	var delta = max-min;
	
	return min + (Math.random()*delta);
}
Math.randomInt = function(a,b){ //random number in {a,...,b} 
	var min = Math.min(a,b);
	var max = Math.max(a,b)+1;
	var delta = max-min;
	
	return Math.floor(min + (Math.random()*delta));
}
Math.mean = function(...args) {
	var sum=0;
	for(i=0;i<arguments.length; i++){
		sum+=arguments[i];
	};
	sum/=arguments.length;
	return sum;
}

function isDefined(a){
	if (typeof a == "undefined")
		return false;
	return true;
}

function constantFunc(value){
	return function(){return value};
}
var constantFunction = constantFunc;

function getTime(){    // timestamp in seconds since 1970-01-01 00:00:00 UTC.
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
	var now = (new Date()).getTime()/1000;
	return now;
}


function generate2DArray(sizeX,sizeY,func){
	var array = new Array(sizeX);
	for (var x = 0; x < sizeX; x++) {
		
		array[x] = new Array(sizeY);
		for (var y = 0; y < sizeY; y++) {
			
			array[x][y] = func(x,y);
		}
	}
	return array;
}

function generateArray(size,func){
	var array = new Array(size);
	for(var i = 0; i<size; i++ ){
		array[i] = func(i);
	}
	
	return array;
}

Array.prototype.wrap = function(...args){
	if (args.length == 1){
		return this[args[0] % this.length];
	} else{
		var index = args.shift();
		return this[index % this.length] . wrap(...args);
	}
}



function Timer(){
	var t		= getTime();
	var dt		= 0;
	var running	= false;
	
	this.start = function(){
		if(!running){
			t = getTime()-dt;
			running = true;
		}
		recalc();
		return dt;
	};
	this.read = function(){
		recalc()
		return dt;
	};
	var recalc = function(){
		if (running){
			dt = getTime()-t;
		}
	}
	this.stop = function(){
		recalc()
		running = false;
		return dt;
	};
	this.reset = function(){
		t		= getTime();
		dt		= 0;
		running	= false;
	}
	this.isRunning = function(){
		return running;
	};
	this.startStop = function(){
		if (running)
			this.stop()
		else
			this.stop()
		return running;
	};
}// end Timer()
