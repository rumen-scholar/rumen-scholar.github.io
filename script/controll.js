/*
[0] 전역 변수 (Global Variables)
[1] 도형 정의
[2] Document, Window 이벤트
[3] Canvas 이벤트
[4] Canvas Item (Object) 이벤트
[5] 메뉴 작동 함수 : 최상단 메뉴
[6] 메뉴 작동 함수 : 객체 속성 입력
[7] 메뉴 작동 함수 : 좌측 도형 버튼
[8] 특수 함수
*/

/* ---------------------------------------------------------------------------------
    [0] 전역 변수 (Global Variables)
--------------------------------------------------------------------------------- */
// canvas 생성 시 이용
var canvas = null;
var canvasDown = false;
var selectedObj = null;
var beforeType = null;

var drawingObj = null;
var drawingStartX = null;
var drawingStartY = null;

var shapeType = null;
var shapeButton = null;
var lineType = null;
var lineButton = null;

let objectControlsMenu = document.querySelectorAll('div.Layer.Menu > .ObjectControl');
let inputOption = document.querySelectorAll('div.Layer.InputOption .Column input');

// var prevFillColor = null;
// var prevStrokeColor = null;


/* ---------------------------------------------------------------------------------
    [1] 도형 정의
--------------------------------------------------------------------------------- */
function normalRectangle() {
    return new fabric.Rect({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'normalRectangle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null
    })
}

function radiusRectangle() {
    return new fabric.Rect({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'radiusRectangle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null,
        rx: 30,
        ry: 30
    })
}

function normalTriangle() {
    return new fabric.Triangle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'normalTriangle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null
    })
}

function normalCircle() {
    return new fabric.Circle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'normalCircle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null,
    })
}


/************************************ FIXME: ************************************/
function rightTriangle() {
    return new fabric.Triangle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'rightTriangle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null,
        skewX: 45,
        absolutePositioned: true
    })
}

function semiCircle() {
    return new fabric.Triangle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'semiCircle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null
    })
}

function quadrantCircle() {
    return new fabric.Triangle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'quadrantCircle',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null
    })
}

function normalStar() {
    return new fabric.Triangle({
        fill: document.querySelector('.SelectionFillColor').value,
        stroke: document.querySelector('.SelectionStrokeColor').value,
        transparentCorners: false,
        objectCaching: false,
        shapeType: 'normalStar',
        uuid: CreateUUIDv4(),
        Facility: null,
        EquipmentNo: null,
        WorkCenter: null,
        TagName: null
    })
}

function DrawingCombination(_shapeType, _lineType) {
    let obj = null;

    if (_shapeType) {
        //도형 그리기 모드
        switch (_shapeType) {
            case "normalRectangle":
                obj = normalRectangle();
                break;
            case "radiusRectangle":
                obj = radiusRectangle();
                break;
            case "normalTriangle":
                obj = normalTriangle();
                break;
            case "rightTriangle":
                obj = rightTriangle();
                break;
            case "normalCircle":
                obj = normalCircle();
                break;
            case "semiCircle":
                obj = semiCircle();
                break;
            case "quadrantCircle":
                obj = quadrantCircle();
                break;
            case "normalStar":
                obj = normalStar();
                break;
        }
        if (_lineType && 'dashedLine' == _lineType) {
            obj.strokeDashArray = [8];
        }
    } else {
        //선 긋기 모드
    }

    return obj;
}



/* ---------------------------------------------------------------------------------
    [2] Document, Window 이벤트
--------------------------------------------------------------------------------- */
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'interactive') {

        DeactivateMenu();

        let canvasElement = document.querySelector('.Layer.Canvas > .FabricJSCanvas');

        let basicWidth = (document.querySelector('.View').offsetWidth - document.querySelector('.LeftSide').offsetWidth) * 0.99;
        let basicHeight = (document.querySelector('.View').offsetHeight - document.querySelector('.TopArea').offsetHeight) * 0.99;


        /* ---------------------------------------------------------------------------------
            Event : canvas on
        --------------------------------------------------------------------------------- */
        canvas = new fabric.Canvas(canvasElement, {
            selection: true, // 다중선택 가능여부
            preserveObjectStacking: true, // 그린 직후 z-index 가 유지되기를 원함. 예) 클릭시 화면 위로 올라오지않음.
            renderOnAddRemove: false, // 기본 동작 이후 자동 렌더링 (추가,삭제,업데이트 등)
            uniformScaling: false // 객체 크기조정 비율 해제
        }).setWidth(basicWidth).setHeight(basicHeight);

        canvas.on({
            'mouse:over': CanvasMouseOver,
            'mouse:down:before': CanvasMouseDownBefore,
            'mouse:down': CanvasMouseDown,
            'mouse:move': CanvasMouseMove,
            'mouse:up:before': CanvasMouseUpBefore,
            'mouse:up': CanvasMouseUp,
            'mouse:dblclick': CanvasDoubleClick,
            'object:scaling': CanvasObjectScaling,
            'selection:created': CanvasSelectionCreated,
            'selection:updated': CanvasSelectionUpdated,
            'before:selection:cleared': CanvasBeforeSelectionCleared,
            'selection:cleared': CanvasSelectionCleared,
        });

        /*
        fabric.ActiveSelection(ActiveSelection, {
            //noScaleCache : true
            objectCaching : false
          });
          */
        //   fabric.ActiveSelection(ActiveSelection, {
        //     objectCaching : false
        // });

    } else if (event.target.readyState === 'complete') {
        //console.log('Call Order : 4');
    }
});

/*	Event : Browser 이탈 시, 되묻기 */
window.addEventListener('beforeunload', (event) => {
    // 표준에 따라 기본 동작 방지
    event.preventDefault();
    // Chrome에서는 returnValue 설정이 필요함
    event.returnValue = '';
});


/*	Event : Browser Resize 시, canvas 조정 */
window.addEventListener("resize", function () {
    console.log('resize');
    let basicWidth = (document.querySelector('.View').offsetWidth - document.querySelector('.LeftSide').offsetWidth) * 0.99;
    let basicHeight = (document.querySelector('.View').offsetHeight - document.querySelector('.TopArea').offsetHeight) * 0.99;

    canvas.setWidth(basicWidth);
    canvas.setHeight(basicHeight);
    canvas.requestRenderAll();
    //캔버스 비율 계산해서 scale 적용 필요할 수 있음
});


/* 	Event : shortcut Key 조합  */
// https://developer.mozilla.org/ko/docs/Web/API/Document/keydown_event
window.addEventListener('keydown', function (event) {
    console.log(event.code);
    switch (event.code) {
        case 'Escape':
            event.preventDefault();

            if (shapeButton) {
                shapeButton.blur();
                shapeButton.style.backgroundColor = null
            }

            if (lineButton) {
                lineButton.blur();
                lineButton.style.backgroundColor = null
            }

            if (canvasDown) {
                canvas.remove(drawingObj);
            }

            canvas.defaultCursor = 'default';
            canvas.selection = true;

            shapeType = null;
            shapeButton = null;
            lineType = null;
            lineButton = null;

            canvas.requestRenderAll();

            break;

        case 'Delete':
            event.preventDefault();

            if (canvas.getActiveObject()) {
                DeleteObject();
            }

            break;

        case 'KeyV':
            if (event.ctrlKey) {
                event.preventDefault();
                if (canvas.getActiveObject()) {
                    CloneObject();
                }
            }

            break;

        case 'Tab':
            if (event.shiftKey && selectedObj) {
                event.preventDefault();
                let _obj = selectedObj
                let _objIndex = canvas.getObjects().indexOf(_obj);

                if (_objIndex > 0) {
                    canvas.setActiveObject(canvas.item(_objIndex - 1))
                    canvas.requestRenderAll();
                }

            } else if (selectedObj) {
                event.preventDefault();
                let _obj = selectedObj
                let _objIndex = canvas.getObjects().indexOf(_obj);
                let maxIndex = canvas.size() - 1;

                if (_objIndex < maxIndex) {
                    canvas.setActiveObject(canvas.item(_objIndex + 1))
                    canvas.requestRenderAll();
                }
            }
            break;
    }
})

/* ---------------------------------------------------------------------------------
    [3] Canvas 이벤트
--------------------------------------------------------------------------------- */
// https://stackoverflow.com/questions/33958845/how-to-freedraw-circle-in-fabricjs-using-mouse
function CanvasMouseOver(evt) {
    //좌측에 도형/선 버튼 클릭 시 마우스포인터 변경
    if (shapeType || lineType) {
        canvas.defaultCursor = 'crosshair';
    }
}

function CanvasMouseDownBefore(evt) {
    //좌측에 도형/선 버튼속성을 지닌채로 Canvas에 포인터 진입 시, 그룹선택:false
    if (shapeType || lineType) {
        canvas.selection = false;
    }
}

function CanvasMouseDown(evt) {
    //Canvas 마우스 Down:true
    canvasDown = true;

    //클릭시작한 위치 정보 획득
    let pointer = canvas.getPointer(evt.e);
    if (shapeType || lineType) {
        drawingStartX = pointer.x;
        drawingStartY = pointer.y;

        //shapeType + lineType 에 의해 목표 도형 지정
        drawingObj = DrawingCombination(shapeType, lineType);

        if (!drawingObj) return;

        drawingObj.left = drawingStartX;
        drawingObj.top = drawingStartY;
        drawingObj.width = pointer.x - drawingStartX;
        drawingObj.height = pointer.y - drawingStartY;

        // drawingObj.on({
        // 	'selected': ObjectSelected,
        // 	'deselected': ObjectDeselected
        // });

        canvas.add(drawingObj);
    }
}

function CanvasMouseMove(evt) {
    if ((shapeType || lineType) && canvasDown && !canvas.getActiveObject()) {
        let pointer = canvas.getPointer(evt.e);

        if (!drawingObj) return;

        if (drawingStartX > pointer.x) {
            drawingObj.set({
                left: Math.abs(pointer.x)
            });
        }
        if (drawingStartY > pointer.y) {
            drawingObj.set({
                top: Math.abs(pointer.y)
            });
        }

        drawingObj.set({
            width: Math.abs(drawingStartX - pointer.x)
        });
        drawingObj.set({
            height: Math.abs(drawingStartY - pointer.y)
        });

        if ('circle' == drawingObj.type) {
            console.log('radiuse')
            drawingObj.radius = Math.max(Math.abs(drawingStartY - pointer.y), Math.abs(drawingStartX - pointer.x)) / 2;
            if (drawingObj.radius > drawingObj.strokeWidth) {
                drawingObj.radius -= drawingObj.strokeWidth / 2;
            }
        }

        canvas.renderAll();
    }
}

function CanvasMouseUpBefore(evt) {
    if ((shapeType || lineType) && canvasDown) {

        if (!drawingObj) return;

        if (drawingObj.width == 0 && drawingObj.height == 0) {
            canvas.remove(drawingObj);
        } else {
            // canvas 객체 제어위치 재조정, 없으면 생성후에 부분선택 안될 수 있음.
            drawingObj.setCoords();
        }

        drawingObj = null;
        drawingStartX = null;
        drawingStartY = null;
    }
}

function CanvasMouseUp(evt) {
    canvasDown = false;
}

function CanvasDoubleClick(evt) {
    if (!selectedObj) {
        window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "ESC",
            keyCode: 27,
            code: "Escape",
            which: 27,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        }));
    }
}

/* FIXME: */
function CanvasSelectionCreated(evt) {
    selectedObj = canvas.getActiveObject();
    if (selectedObj) {
        ActivateMenu();

        _obj = selectedObj;
        if ('activeSelection' == _obj.type) {

        } else {
            SetStyleProperties(selectedObj);
            SetConnectorProperties(selectedObj);
        }
    }

}

function CanvasSelectionUpdated(evt) {
    selectedObj = canvas.getActiveObject();
    if (selectedObj) {
        ActivateMenu();

        _obj = selectedObj;
        if ('activeSelection' == _obj.type) {

        } else {
            SetStyleProperties(selectedObj);
            SetConnectorProperties(selectedObj);
        }
    }
}

/* 
case1: rect, circle 등 정상타입 선택해제
case2: 다중 선택 해제 (activeSelection)
case3: 그룹지정 후 그룹해제 (group) ==> 그룹해제 시 selection:cleared 발생 
*/
function CanvasBeforeSelectionCleared(evt) {
    beforeType = evt.target.type;
}

/* FIXME: */
function CanvasSelectionCleared(evt) {
    ClearStyleProperties();
    ClearConnectorProperties();

    if ('group' != beforeType) {
        DeactivateMenu();
    }
    selectedObj = null;
}

//fabric.Object.prototype.objectCaching = false;


//https://stackoverflow.com/questions/43986000/constant-stroke-width-rectangle-with-fabricjs
function CanvasObjectScaling(evt) {
    evt.target.resizeToScale(evt.target);
}
fabric.Object.prototype.resizeToScale = function (resizingObj) {
    // resizes an object that has been scaled (e.g. by manipulating the handles), setting scale to 1 and recalculating bounding box where necessary
    switch (resizingObj.type) {
        case "circle":
            resizingObj.radius *= resizingObj.scaleX;
            resizingObj.scaleX = 1;
            resizingObj.scaleY = 1;
            resizingObj.cacheWidth = resizingObj.width;
            resizingObj.cacheHeight = resizingObj.height;
            break;
        case "ellipse":
            resizingObj.rx *= resizingObj.scaleX;
            resizingObj.ry *= resizingObj.scaleY;
            resizingObj.width = resizingObj.rx * 2;
            resizingObj.height = resizingObj.ry * 2;
            resizingObj.cacheWidth = resizingObj.width;
            resizingObj.cacheHeight = resizingObj.height;
            resizingObj.scaleX = 1;
            resizingObj.scaleY = 1;
            break;
        case "polygon":
        case "polyline":
            var points = resizingObj.get('points');
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                p.x *= resizingObj.scaleX
                p.y *= resizingObj.scaleY;
            }
            resizingObj.scaleX = 1;
            resizingObj.scaleY = 1;
            // version error
            // resizingObj.width = resizingObj.getBoundingBox().width;
            // resizingObj.height = resizingObj.getBoundingBox().height;
            resizingObj.width = resizingObj.getBoundingRect().width;
            resizingObj.height = resizingObj.getBoundingRect().height;
            resizingObj.cacheWidth = resizingObj.width;
            resizingObj.cacheHeight = resizingObj.height;
            break;
        case "triangle":
        case "line":
        case "rect":
            resizingObj.width *= resizingObj.scaleX;
            resizingObj.height *= resizingObj.scaleY;
            resizingObj.cacheWidth = resizingObj.width;
            resizingObj.cacheHeight = resizingObj.height;
            resizingObj.scaleX = 1;
            resizingObj.scaleY = 1;
            break;
        case "activeSelection":
        case "group":
            /*
            resizingObj._objects.forEach(function (obj) {
                window.fabric.Object.prototype.resizeToScale(obj);
            })
            */            
            break;
        default:
            break;
    }
    SetStyleProperties(resizingObj);
    SetConnectorProperties(resizingObj);
}

/* ---------------------------------------------------------------------------------
    [4] Canvas Item (Object) 이벤트
--------------------------------------------------------------------------------- */




/* ---------------------------------------------------------------------------------
    [5] 메뉴 작동 함수 : 최상단 메뉴
--------------------------------------------------------------------------------- */
function ExitLayoutEditor() {
    alert('ExitScreen');
}

function SaveLayoutEditor() {
    alert('SaveLayoutEditor');
}

function ZoomInLayoutEditor() {
    alert('ZoomInLayoutEditor');
}

function ZoomOutLayoutEditor() {
    alert('ZoomOutLayoutEditor');
}

function UndoLayoutEditor() {
    alert('UndoLayoutEditor');
}

function RedoLayoutEditor() {
    alert('RedoLayoutEditor');
}


/*  최삳단 객체 상호작용 메뉴 (삭제, 복제, 그룹지정, 그룹해제, Z-index 4종)  */
function DeleteObject() {
    _selectObj = canvas.getActiveObject();

    canvas.discardActiveObject();

    if (_selectObj.type === 'activeSelection') {
        _selectObj.forEachObject(function (obj) {
            canvas.remove(obj);
        });
    } else {
        canvas.remove(_selectObj)
    };

    canvas.requestRenderAll();
}


function CloneObject() {
    //http://fabricjs.com/copypaste
    canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
    });

    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 15,
            top: clonedObj.top + 15,
            evented: true,
            uuid: CreateUUIDv4()
        });
        //그룹으로 선택할 시 type = activeSelection
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                canvas.add(obj);
            });

            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 15;
        _clipboard.left += 15;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}

function SetGroupObject() {
    //http://fabricjs.com/manage-selection
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObject().toGroup();
    //canvas.getActiveObject().toGroup().set({objectCaching: false});
    CanvasSelectionCreated();
    canvas.requestRenderAll();
}

function ReleaseGroupObject() {
    //http://fabricjs.com/manage-selection
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'group') {
        return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
}


//https://github.com/fabricjs/fabric.js/wiki/FAQ#how-can-i-change-the-order-of-objects-on-the-canvas
function ObjectIndexControll(_type) {
    let obj = canvas.getActiveObject();

    if (_type && obj) {
        switch (_type) {
            case "ToFront":
                obj.bringToFront();
                canvas.requestRenderAll();
                break;
            case "Forward":
                obj.bringForward();
                canvas.requestRenderAll();
                break;
            case "Backward":
                obj.sendBackwards();
                canvas.requestRenderAll();
                break;
            case "ToBack":
                obj.sendToBack();
                canvas.requestRenderAll();
                break;
            default:
                alert('type error!!');
                break;
        }
    } else {
        alert('obj error!!');
    }
}

function ActivateMenu() {
    let ObjectControls = document.querySelectorAll('div.Layer.Menu > .ObjectControl');
    let inputOption = document.querySelectorAll('div.Layer.InputOption .Column input');

    ObjectControls.forEach((menu) => {
        menu.style.pointerEvents = 'auto';
        menu.style.opacity = '1';
    });
    inputOption.forEach((input) => {
        input.disabled = false;
    });
}

function DeactivateMenu() {
    let ObjectControls = document.querySelectorAll('div.Layer.Menu > .ObjectControl');
    let inputOption = document.querySelectorAll('div.Layer.InputOption .Column input');

    ObjectControls.forEach((menu) => {
        menu.style.pointerEvents = 'none';
        menu.style.opacity = '0.4';
    });
    inputOption.forEach((input) => {
        input.disabled = true;
    });
}

function ActivateStylePropertiesMenu()
{

}

function ActivateConnectorPropertiesMenu()
{

}

function DeactivateStylePropertiesMenu()
{

}

function DeactivateConnectorPropertiesMenu()
{

}



function SetStyleProperties(_obj) {
    if (_obj) {
        document.querySelector('.InputOption .StyleProperties input.top').value = _obj.top;
        document.querySelector('.InputOption .StyleProperties input.left').value = _obj.left;
        document.querySelector('.InputOption .StyleProperties input.height').value = _obj.height;
        document.querySelector('.InputOption .StyleProperties input.width').value = _obj.width;
        document.querySelector('.InputOption .StyleProperties input.strokeWidth').value = _obj.strokeWidth;
        document.querySelector('.InputOption .StyleProperties input.opacity').value = _obj.opacity;
    }
}

function SetConnectorProperties(_obj) {
    if (_obj) {
        document.querySelector('.InputOption .ConnectorProperties input.Facility').value = _obj.Facility;
        document.querySelector('.InputOption .ConnectorProperties input.WorkCenter').value = _obj.WorkCenter;
        document.querySelector('.InputOption .ConnectorProperties input.EquipmentNo').value = _obj.EquipmentNo;
        document.querySelector('.InputOption .ConnectorProperties input.TagName').value = _obj.TagName;
    }
}

function ClearStyleProperties() {
    document.querySelector('.InputOption .StyleProperties input.top').value = null;
    document.querySelector('.InputOption .StyleProperties input.left').value = null;
    document.querySelector('.InputOption .StyleProperties input.height').value = null;
    document.querySelector('.InputOption .StyleProperties input.width').value = null;
    document.querySelector('.InputOption .StyleProperties input.strokeWidth').value = null;
    document.querySelector('.InputOption .StyleProperties input.opacity').value = null;
}

function ClearConnectorProperties() {
    document.querySelector('.InputOption .ConnectorProperties input.Facility').value = null;
    document.querySelector('.InputOption .ConnectorProperties input.WorkCenter').value = null;
    document.querySelector('.InputOption .ConnectorProperties input.EquipmentNo').value = null;
    document.querySelector('.InputOption .ConnectorProperties input.TagName').value = null;
}

/* ---------------------------------------------------------------------------------
    [6] 메뉴 작동 함수 : 객체 속성 입력
--------------------------------------------------------------------------------- */
function ChangeStyleProperties(_type, _obj) {
    console.log(_type, _obj);
}

function ChangeConnectorProperties(_type, _obj) {
    console.log(_type, _obj);
}



/* ---------------------------------------------------------------------------------
    [7] 메뉴 작동 함수 : 좌측 도형 버튼
--------------------------------------------------------------------------------- */
/*  좌측 모양 버튼  */
function SetShapeType(_type, _obj) {

    if (shapeButton) {
        shapeButton.blur();
        shapeButton.style.backgroundColor = null
    }

    shapeType = _type;
    shapeButton = _obj;

    _obj.style.backgroundColor = '#008CBA';
}

/*  좌측 Line 버튼  */
function SetLineType(_type, _obj) {

    if (lineButton) {
        lineButton.blur();
        lineButton.style.backgroundColor = null
    }

    lineType = _type;
    lineButton = _obj;

    _obj.style.backgroundColor = '#008CBA';
}

/*  좌측 Color 버튼  */
function ChangeFillColor(_type, _obj) {
    if (selectedObj) {
        canvas.getActiveObject().set("fill", _obj.value);
        canvas.requestRenderAll();
    }
}

function ChangeStrokeColor(_type, _obj) {
    if (selectedObj) {
        canvas.getActiveObject().set("stroke", _obj.value);
        canvas.requestRenderAll();
    }
}

function SetTemplate(_type) {

}


/* ---------------------------------------------------------------------------------
    [8] 특수 함수
--------------------------------------------------------------------------------- */
function CreateUUIDv4() {
    //RFC4122 version4 Spec
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}