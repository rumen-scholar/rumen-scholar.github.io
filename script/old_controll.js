
document.addEventListener('readystatechange', (event) => {
	if (event.target.readyState === 'interactive') {
		//console.log('Call Number : 2');
		/* ---------------------------------------------------------------------------------
			도형 파레트 버튼 이벤트 지정
		--------------------------------------------------------------------------------- */
		const shapePalettes = document.querySelectorAll('.ShapePalette .ShapeButton');
		shapePalettes.forEach((shapeButton) => {
			shapeButton.addEventListener('click', function (e) {
				// 캡쳐링,버블링 위치 (span 찍힐 때가 있음)
				//let node = e.target;
				//this 핸들링 위치로 대체
				let node = this;
				let nodeChild = node.firstChild;
				let nodeClassName = nodeChild.className;

				staticObject.AddObject(nodeClassName);
			})
		});

		/* ---------------------------------------------------------------------------------
			선 파레트 버튼 이벤트 지정
		--------------------------------------------------------------------------------- */
		const linePalettes = document.querySelectorAll('.LinePalette button');
		linePalettes.forEach((lineButton) => {
			lineButton.addEventListener('click', function (e) {
				console.log(e.target);

			});
		});

		window.addEventListener("optimizedResize", function () {
			console.log("Resize");
			// staticObject.canvasWidth = document.querySelector('div.Layer.Canvas').clientWidth;
			// staticObject.canvasHeight = document.querySelector('div.Layer.Canvas').clientHeight;

			// canvas.setWidth(staticObject.canvasWidth);
			// canvas.setHeight(staticObject.canvasHeight);
			// canvas.requestRenderAll();
		});

	} else if (event.target.readyState === 'complete') {
		//console.log('Call Number : 4');
	}
});


/* ---------------------------------------------------------------------------------
	canvas DOM 이 그려진 후에 실행시켜야 함.
--------------------------------------------------------------------------------- */
var canvas = null;
window.addEventListener('load', (event) => {
	//console.log('Call Number : 5');
	staticObject.canvasWidth = document.querySelector('div.Layer.Canvas').clientWidth;
	staticObject.canvasHeight = document.querySelector('div.Layer.Canvas').clientHeight;

	var canvasElement = document.querySelector('.Layer.Canvas > .FabricJSCanvas');
	canvas = new fabric.Canvas(canvasElement, {
		renderOnAddRemove: false
	}).setWidth(staticObject.canvasWidth).setHeight(staticObject.canvasHeight);
});


/* ---------------------------------------------------------------------------------
	Browser Resizing 시, canvas 조정
--------------------------------------------------------------------------------- */
window.addEventListener("resize", function () {

	let resizingWidth = document.querySelector('div.Layer.Canvas').clientWidth;
	let resizingHeight = document.querySelector('div.Layer.Canvas').clientHeight;

	canvas.setWidth(resizingWidth);
	canvas.setHeight(resizingHeight);
	canvas.requestRenderAll();
});



/* ---------------------------------------------------------------------------------
	사용자 리터럴 객체 : 싱글톤
--------------------------------------------------------------------------------- */

// function ShapeCreator ()
// { 
// 	ShapeCreator.create = function(type)
// 	{
// 		let shape = null;
// 	    switch(type)
// 	    {
// 	    	case normalRectangle: 
// 			shape =  new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 	    	case radiusRectangle: 
// 			shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			shape =  new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 	    }

// 		return shape;
//    }
// }



// var Shape = ShapeCreator.create(Shape.normalRectangle);
// canvas.add(Shape);


// function Shape (type)
// {
// 	const normalRectangle = 1;
// 	const radiusRectangle = 2;
 
// 	this.shape             = null;
// 	this.selectShapeButton = null;
// 	this.selectLineButton  = null;
// 	this.drawingMode       = null;
// 	this.canvasWidth       = null;
// 	this.canvasHeight      = null;
 
//     this.create = function()
// 	{
// 	    switch(type)
// 	    {
// 	    	case normalRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 	    	case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 
// 			case radiusRectangle: 
// 			this.shape = new fabric.Rect({
// 	    		left: 100,
// 	    		top: 100,
// 	    		fill: 'red',
// 	    		width: 20,
// 	    		height: 20,
// 	    		angle: 0
// 	    	});
// 	    	break; 

// 	    }
//    }

//    this.create();
// }

 
// var shape = new Shape(Shape.normalRectangle);
// canvas.add(shape.shape);





var staticObject = {
	shape: null,
	selectShapeButton: null,
	selectLineButton: null,
	drawingMode: null,
	canvasWidth: null,
	canvasHeight: null,

	DeleteObject: function () {

	},
	AddObject: function (_className) {

		switch (_className) {

			case 'normalRectangle':
				staticObject.shapeTemplate.normalRectangle();
				break;
			case 'radiusRectangle':
				staticObject.shapeTemplate.radiusRectangle();
				break;
			case 'normalTriangle':
				staticObject.shapeTemplate.normalTriangle();
				break;
			case 'rightTriangle':
				staticObject.shapeTemplate.rightTriangle();
				break;
			case 'normalCircle':
				staticObject.shapeTemplate.normalCircle();
				break;
			case 'semiCircle':
				staticObject.shapeTemplate.semiCircle();
				break;
			case 'quadrantCircle':
				staticObject.shapeTemplate.quadrantCircle();
				break;
			case 'normalStar':
				staticObject.shapeTemplate.normalStar();
				break;

			default:
				console.log('exception');
				break;
		}
		canvas.requestRenderAll();
	},
	shapeTemplate: ({
		// 사각형
		normalRectangle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 둥근모서리 사각형
		radiusRectangle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'green',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 삼각형
		normalTriangle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 직각삼각형
		rightTriangle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 원형
		normalCircle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 반원
		semiCircle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 1/4 원
		quadrantCircle: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		},
		// 별
		normalStar: function () {
			staticObject.shape = new fabric.Rect({
				left: 100,
				top: 100,
				fill: 'red',
				width: 20,
				height: 20,
				angle: 0
			})
			canvas.add(staticObject.shape);
			staticObject.shape = null;
		}
	}),
	lineTemplate: ({
		normalLine: function () {
			console.log('normalLine');
		}
	}),


}