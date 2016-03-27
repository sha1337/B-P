"use strict";
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//            #   #       ###       ###      ###          #####      ###             //
//            #   #        #       #        #   #             #     #                //
//           # # # #       #        ##      #                 #      ##              //
//           # # # #       #          #     #   #         #   #        #             //
//           #  #  #      ###      ###       ###     #     ###      ###              //
//                                                                                   //
//          Extending the native JS objects with more or less usefull stuff.         //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////

// Math:
Math.TAU = Math.PI *2; // Might be usefull, because TAU is aquivalent of a full turn
/////////////////////////////
Math.randomFloat = function(a,b){ // random number in [a,b)
	var min = Math.min(a,b);
	var max = Math.max(a,b);
	var delta = max-min;
	
	return min + (Math.random()*delta);
}
/////////////////////////////
Math.randomBool= function(pVal){ //returns true with a probability of pVal
	return (Math.random()<=pVal);
}
// this can be used to simulate Bernoulli distribution:
// (+Math.randomBool(.5))
/////////////////////////////
Math.randomInt = function(a,b){ //random number in {a,...,b} uniform distributed
	var min = Math.min(a,b);
	var max = Math.max(a,b)+1;
	var delta = max-min;
	
	return Math.floor(min + (Math.random()*delta));
}
/////////////////////////////
Math.mean = function(...args) {
	var sum=0;
	for(var i=0;i<arguments.length; i++){
		sum+=arguments[i];
	};
	sum/=arguments.length;
	return sum;
}
/////////////////////////////
Math.sq = function(a){ // squares a value;
	return a*a;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Misc

function isDefined(a){
	 // this function replaces string comaparision in other code, "undefined" as a 
	 // "magic string" may lead to mistakes
	if (typeof a == "undefined")
		return false;
	return true;
}

/*
Replace with var f =()=>value;

function constantFunc(value){
	// this function returns an anonymous function that returns the same value 
	// independent of the arguments
	return function(){return value};
}
var constantFunction = constantFunc;
*/

function getTime(){    // timestamp in seconds since 1970-01-01 00:00:00 UTC.
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
	var now = (new Date()).getTime()/1000;
	return now;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Array

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
	if (args.length == 1){ // last step
		return this[args[0] % this.length];
	}else{
		var index = args.shift(); // first element
		return this[index % this.length] . wrap(...args);
	}
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Function

/** Not mine:
https://javascriptweblog.wordpress.com/2010/04/14/compose-functions-as-building-blocks/
*/
Function.prototype.on  = function(secondFunc) {
// g.on(f) = [ x |--> g(f(x)) ] = g(f)
// g applied ON f
	var firstFunc = this;
	return function() {
		return  firstFunc.call(this,secondFunc.apply(this,arguments));
	}
}

Function.prototype.then  = function(secondFunc) {
// g.then(f) = [ x |--> f(g(x)) ] = f(g)
// calls g first, THEN calls f on the result
	var firstFunc = this;
	return function() {
		var firstResult =  firstFunc.apply(this, arguments)
		return secondFunc.call(this, firstResult);
	}
}
/*
Example use:
var coinToss = 
	Math.random          // random number in (0,1)
		.then(x=>(x<.5)) // random boolean
		.then(x=>(x?"heads":"tails"));
*/


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function generate_BalancedPlaneGeometry() {
	// a plane with one center vertex, the center vertex is in the barycenter of the four corners, 
	//  resulting in a symetrical and smoth surface
	/*  balanced_plane
	  01_______________02
	   |`.           .´|
	   |  `.   F1  .´  |
	   |    `.   .´    |
	   |  F4  `00   F2 | 
	   |     .´ `.     |
	   |   .´     `.   |
	   | .´    F3   `. |
	   |´_____________`|
	  03               04
	*/
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 0,1, 0),
		new THREE.Vector3(-1,0,+1),
		new THREE.Vector3(+1,0,+1),
		new THREE.Vector3(-1,0,-1),
		new THREE.Vector3(+1,0,-1)
	);
	
	
	geometry.updateCenter = function(){
		this.vertices[0].x = Math.mean(
			this.vertices[1].x,
			this.vertices[2].x,
			this.vertices[3].x,
			this.vertices[4].x
		);
		
		this.vertices[0].y = Math.mean(
			this.vertices[1].y,
			this.vertices[2].y,
			this.vertices[3].y,
			this.vertices[4].y
		);
		this.vertices[0].z = Math.mean(
			this.vertices[1].z,
			this.vertices[2].z,
			this.vertices[3].z,
			this.vertices[4].z
		);
		geometry.computeBoundingSphere();
	}
	
	
	geometry.faces = [];
	geometry.faces.push(
		new THREE.Face3( 0, 1, 2),
		new THREE.Face3( 0, 2, 4),
		new THREE.Face3( 0, 4, 3),
		new THREE.Face3( 0, 3, 1)
	);
	
	
	
	geometry.computeBoundingSphere();
	return geometry;
}


