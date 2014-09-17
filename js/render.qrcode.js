/*
 * Copyright (c) 2012 Yamitzky, http://yamitzky.com/
 * The MIT License
 *
 * Derived From jquery.qrcode.js
 * Copyright (c) 2011 Jerome Etienne, http://jetienne.com
 * The MIT License
 */
HTMLElement.prototype.qrcode = function(options) {
  // if options is string, 
  if( typeof options === 'string' ){
    options	= { text: options };
  }

  // set default values
  // typeNumber < 1 for automatic calculation
  options = options || {};
  var default_options = {
    render		: "canvas",
    width		: 256,
    height		: 256,
    typeNumber	: -1,
    correctLevel	: QRErrorCorrectLevel.H,
    background      : "#ffffff",
    foreground      : "#000000"
  };
  for (var key in default_options){
    if(!options[key]){
      options[key] = default_options[key]
    }
  }
  var checkArea = function(x,y,qrcode){
	  var w=qrcode.getModuleCount();
	  var h=w;
	  //console.log(w+","+h);
	  if(x>=0&&x<=7){
		  if(y>=0&&y<=7){
			  //area 1
			  console.log("("+x+","+y+")~"+1);
			  return 1;
		  }
		  else if((y>=(h-8))&&(y<=h)){
			  //area 3
			  console.log("("+x+","+y+")~"+3);
			  return 3;
		  }
		  else{
			  console.log("("+x+","+y+")~"+0);
			  return 0;
		  }
	  }
	  else if((x>=(w-8)&&x<=w)&&(y>=0&&y<=7)){
		  //area 2
		  console.log("("+x+","+y+")~"+2);
		  return 2;
	  }
	  else if((x>=(w-9)&&x<=(w-5))&&(y>=(w-9)&&y<=(w-5))){
		  //area 4
		  console.log("("+x+","+y+")~"+4);
		  return 4;
	  }
	  else{
		  //others
		  //console.log("("+x+","+y+")~"+0);
		  return 0;
	  }
  }
  var createArea=function(tx,ty,area,ctx,moduleCount){
		
		/*switch(area){
			case 1:
				tx=0,
				ty=0;
			break;
			case 2:
				tx=qrcode.getModuleCount()-7,
				ty=0;
			break;
			case 3:
				tx=0,
				ty=qrcode.getModuleCount()-7;
			break;
			case 4:
				tx=qrcode.getModuleCount()-9,
				ty=qrcode.getModuleCount()-9;
			break;
			default:;
		}*/
		var tileW	= options.width  / (moduleCount+2);
    	var tileH	= options.height / (moduleCount+2);
		console.log(tileW+","+tileH);
		tx+=1;
		ty+=1;
		//整体偏移一个tile
		ctx.globalAlpha=0.5;
		if(area==1||area==2||area==3)
		{
			ctx.fillStyle=options.background;
			ctx.roundRect((tx-1)*tileW,(ty-1)*tileH,tileW*9,tileH*9,tileW).fill();
			ctx.fillStyle = options.foreground;
			ctx.clearRect(tx*tileW,ty*tileH,tileW*7,tileH*7);
			ctx.roundRect(tx*tileW,ty*tileH,tileW*7,tileH*7,tileW).fill();
			ctx.fillStyle=options.background;
			ctx.clearRect((tx+1)*tileW,(ty+1)*tileH,tileW*5,tileH*5);
			ctx.roundRect((tx+1)*tileW,(ty+1)*tileH,tileW*5,tileH*5,tileW).fill();
			ctx.fillStyle = options.foreground;
			ctx.clearRect((tx+2)*tileW,(ty+2)*tileH,tileW*3,tileH*3);
			ctx.roundRect((tx+2)*tileW,(ty+2)*tileH,tileW*3,tileH*3,tileW).fill();
		}
		else if(area==4){
			ctx.fillStyle = options.foreground;
			ctx.roundRect(tx*tileW,ty*tileH,tileW*5,tileH*5,tileW).fill();
			ctx.fillStyle=options.background;
			ctx.clearRect((tx+1)*tileW,(ty+1)*tileH,tileW*3,tileH*3);
			ctx.roundRect((tx+1)*tileW,(ty+1)*tileH,tileW*3,tileH*3,tileW).fill();
			ctx.fillStyle = options.foreground;
			ctx.clearRect((tx+2)*tileW,(ty+2)*tileH,tileW*1,tileH*1);
			ctx.roundRect((tx+2)*tileW,(ty+2)*tileH,tileW*1,tileH*1,tileW).fill();
		}
	}
  var createCanvas	= function(){
	  
	  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		this.beginPath();
		this.moveTo(x+r, y);
		this.arcTo(x+w, y, x+w, y+h, r);
		this.arcTo(x+w, y+h, x, y+h, r);
		this.arcTo(x, y+h, x, y, r);
		this.arcTo(x, y, x+w, y, r);
		// this.arcTo(x+r, y);
		this.closePath();
		return this;
		}
    // create the qrcode itself
    var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(options.text);
    qrcode.make();
	//console.log(qrcode.typeNumber);
    // create canvas element
    var canvas	= document.createElement('canvas');
    canvas.width	= options.width;
    canvas.height	= options.height;
    var ctx		= canvas.getContext('2d');

    // compute tileW/tileH based on options.width/options.height
    //var tileW	= options.width  / qrcode.getModuleCount();
    //var tileH	= options.height / qrcode.getModuleCount();
	
	var tileW	= options.width  / (qrcode.getModuleCount()+2);
    var tileH	= options.height / (qrcode.getModuleCount()+2);
	
	//var tileW=spaceW-1;
	//var tileH=spaceH-1;
	
	/*var backgroundImg=new Image();
	backgroundImg.src="../zeeging.jpg";
	backgroundImg.onload=function(){
		ctx.globalAlpha=0.4;
		ctx.drawImage(backgroundImg,0,0,options.width,options.height);
		ctx.globalAlpha=1;
	}*/
	
    // draw in the canvas
	ctx.globalAlpha=0.3;
    for( var row = 0; row < qrcode.getModuleCount(); row++ ){
      for( var col = 0; col < qrcode.getModuleCount(); col++ ){
		if(checkArea(col,row,qrcode)==0){
			if(qrcode.isDark(row, col)){
				ctx.fillStyle = options.foreground;
				ctx.globalAlpha=0.2;
			}
			else{
				ctx.fillStyle = options.background;
				ctx.globalAlpha=0.1;
			}
			//ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
			var w = (((col+1)*tileW) - (col*tileW));
			var h = (((row+1)*tileH) - (row*tileH));
			ctx.fillRect((col*(tileW))+tileW,(row*(tileH))+tileH, w, h);
		}
      }	
    }
	ctx.globalAlpha=0.9;
	for( var row = 0; row < qrcode.getModuleCount(); row++ ){
      for( var col = 0; col < qrcode.getModuleCount(); col++ ){
        if(checkArea(col,row,qrcode)==0){
			if(qrcode.isDark(row, col)){
				ctx.fillStyle = options.foreground;
				ctx.globalAlpha=0.2;
			}
			else{
				ctx.fillStyle = options.background;
				ctx.globalAlpha=0.2;
			}
			//ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
			var w = (((col+1)*tileW) - (col*tileW));
			var h = (((row+1)*tileH) - (row*tileH));
			ctx.fillRect((col*(tileW))+(tileW*(1/3))+tileW,(row*(tileH))+(tileH*(1/3))+tileH, w*(1/3), h*(1/3));  
		}
      }	
    }
	
	createArea(0,0,1,ctx,qrcode.getModuleCount());
	createArea(qrcode.getModuleCount()-7,0,2,ctx,qrcode.getModuleCount());
	createArea(0,qrcode.getModuleCount()-7,3,ctx,qrcode.getModuleCount());
	createArea(qrcode.getModuleCount()-9,qrcode.getModuleCount()-9,4,ctx,qrcode.getModuleCount());
	
	
	//createArea(qrcode.getModuleCount()-7,0,ctx);
	
	
	/*
	for( var row=0;row<qrcode.getModuleCount();row++){
		for( var col = 0; col < qrcode.getModuleCount(); col++ ){
			ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
			console.log(ctx.fillStyle);
			var x=(col*spaceW)+(tileW/2);
			var y=(row*spaceH)+(tileH/2);
			console.log(x+","+y);
			ctx.arc(x,y,tileW*0.8,0,Math.PI*2,true);	
			ctx.closePath();
			ctx.fill();
		}
	}*/
    // return just built canvas
    return canvas;
  }

  // from Jon-Carlos Rivera (https://github.com/imbcmdth)
  var createTable	= function(){
    // create the qrcode itself
    var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(options.text);
    qrcode.make();
    
    // create table element
    var table = document.createElement('table');
    table.style.width = options.width+"px";
    table.style.height = options.height+"px";
    table.style.border = "0px";
    table.style.borderCollapse = "collapse";
    table.style.backgroundColor = options.background;
    
    // compute tileS percentage
    var tileW	= options.width / qrcode.getModuleCount();
    var tileH	= options.height / qrcode.getModuleCount();

    // draw in the table
    for(var row = 0; row < qrcode.getModuleCount(); row++ ){
      var _row = document.createElement('tr');
      _row.style.height = tileH + "px";
      table.appendChild(_row);
      
      for(var col = 0; col < qrcode.getModuleCount(); col++ ){
        var td = document.createElement('td');
        td.style.width = tileW+"px";
        td.style.backgroundColor = qrcode.isDark(row, col) ? options.foreground : options.background
        _row.appendChild(td);
      }	
    }
    // return just built canvas
    return table;
  }

  var element	= options.render == "canvas" ? createCanvas() : createTable();
  return this.appendChild(element);
};
