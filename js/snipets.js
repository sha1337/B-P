"use strict";

function gen_cross_cap(){
	function surf(u,v){
		// http://mathworld.wolfram.com/Cross-Cap.html
		u*= Math.PI*2;
		v*= Math.PI/2;

		return new THREE.Vector3(
			2*Math.cos(u)*Math.sin(2*v),
			2*Math.sin(u)*Math.sin(2*v),
			2*( Math.pow(Math.cos(v),2) - Math.pow(Math.cos(u),2) * Math.pow(Math.cos(v),2) )
		);
	}
	var geometry = new THREE.ParametricGeometry(surf,20,20);
	return geometry;
}
 
function gen_rho_dodeca() {
//https://en.wikipedia.org/wiki/Rhombic_dodecahedron
	var geometry = new THREE.Geometry();
	var h =  1 + Math. sqrt(3)/2;
	geometry.vertices.push(
		//inner cube
		/*
		    05_____________04
		    /|            /|
		   / |           / |
		01/__|_________00  |
		 |   |         |   |
		 |   |_________|___|07
		 |  /06        |  /
		 | /           | /
		 |/____________|/
		02              03
		*/
		new THREE.Vector3(  1,   1,  1 ),//00 
		new THREE.Vector3( -1,   1,  1 ),//01
		new THREE.Vector3( -1,  -1,  1 ),//02
		new THREE.Vector3(  1,  -1,  1 ),//03           
		new THREE.Vector3(  1,   1, -1 ),//04  
		new THREE.Vector3( -1,   1, -1 ),//05
		new THREE.Vector3( -1,  -1, -1 ),//06
		new THREE.Vector3(  1,  -1, -1 ),//07
		
		//tip of the pyramids outside of the cube
		new THREE.Vector3(  0,   0,  h ),//08 
		new THREE.Vector3(  0,   h,  0 ),//09
		new THREE.Vector3(  h,   0,  0 ),//10
		new THREE.Vector3(  0,   0, -h ),//11   
		new THREE.Vector3(  0,  -h,  0 ),//12
		new THREE.Vector3( -h,   0,  0 ) //13
			
			
	);
	geometry.faces.push(
		new THREE.Face3( 0, 1,  8), // front pyramid (0,1,2,3)
		new THREE.Face3( 1, 2,  8),
		new THREE.Face3( 2, 3,  8),
		new THREE.Face3( 3, 0,  8),
		
		new THREE.Face3( 5, 4,  11), // back pyramid (4,5,6,7)
		new THREE.Face3( 6, 5,  11),
		new THREE.Face3( 7, 6,  11),
		new THREE.Face3( 4, 7,  11),
		
		new THREE.Face3( 1, 0,  9), // top pyramid (0,1,5,4)
		new THREE.Face3( 5, 1,  9),
		new THREE.Face3( 4, 5,  9),
		new THREE.Face3( 0, 4,  9),
		
		new THREE.Face3( 3, 2,  12), // bottom pyramid (2,3,7,6)
		new THREE.Face3( 7, 3,  12),
		new THREE.Face3( 6, 7,  12),
		new THREE.Face3( 2, 6,  12),
		                   
		new THREE.Face3( 0, 3,  10), // Right pyramid (0,3,7,4)
		new THREE.Face3( 3, 7,  10),
		new THREE.Face3( 7, 4,  10),
		new THREE.Face3( 4, 0,  10),
		
		new THREE.Face3( 2, 1,  13), // left pyramid (1,2,6,5)
		new THREE.Face3( 6, 2,  13),
		new THREE.Face3( 5, 6,  13),
		new THREE.Face3( 1, 5,  13)
		
		
	);
	geometry.computeBoundingSphere();
	return geometry;
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


function loadImageFromURL(imageURL,then){
	var imageObj = new Image(); // make Object
	imageObj.src = imageURL;
	loadImageFromObject(imageObj,then);
}

function loadImageFromObject(imgVar, then){
	if(imgVar.complete){ //is Image loaded?
		var can = document.createElement("canvas");
		
		var xDim = imgVar.width;
		var yDim = imgVar.height;
		
		console.log("loading complete ["+ imgVar.src +", "+xDim+","+yDim+"]");
		
		can.width = xDim;
		can.height = yDim;
		
		can = can.getContext('2d');
		can.drawImage(imgVar, 0, 0); 
		var data = can.getImageData(0,0, xDim, yDim).data;
		
		var mat = new Array(xDim);
		for (var x = 0; x<xDim;x++){
			mat[x] = new Array(yDim)
			for (var y = 0; y<yDim;y++){
				var i = (y*xDim+x)*4;
				var red   = data[i+0];
				var green = data[i+1];
				var blue  = data[i+2];
				var alpha = data[i+3];
				
				mat[x][y] = [red,green,blue,alpha]; //[data[i],data[i+1],data[i+2],data[i+3]];
			}
		}
		then(mat);
	}
	else{
		console.log("waiting ["+imgVar.src+"]")
		imgVar.onload = function() {
			loadImageFromObject(imgVar,then);
		};
	};
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/*
function Map(){
	this.isLoaded     = false;
	this.dimensions   = [1,1];
	this.onload       = void; 
	this.getHeightMap = function(x,z){
		var y = 0;
		// advanced code here;
		return y;
	}  
}
*/

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function Timer(){
	// maybe this could be used to make a "pause"-able game/application.
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
