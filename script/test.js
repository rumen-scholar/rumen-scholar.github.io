var mainCanvas, canvas1, canvas2, padding = 10,
    view = false;

var canvas1Config = {
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1,
};

var canvas2Config = {
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1,
};

function dropText() {
    var text = new fabric.IText('test');
    mainCanvas.add(text);
}

function changeView(value) {
    if (view) {
        $viewText.textContent = "Back";
        mainCanvas = canvas1;
        $('#canvas1').parent().css('display', 'block');
        $('#canvas2').parent().css('display', 'none');
    } else {
        $viewText.textContent = "Front";
        mainCanvas = canvas2;
        $('#canvas1').parent().css('display', 'none');
        $('#canvas2').parent().css('display', 'block');
    }
    canvas1.setHeight(412);
    canvas1.setWidth(637);
    canvas2.setHeight(412);
    canvas2.setWidth(637);
    view = !view;
    updateMementoButtons();
}

// Save as image
function download(url, name) {
    $('#downloader').attr({
        href: url,
        download: name
    })[0].click();
}

function save() {
    mainCanvas.deactivateAll().renderAll();
    var c = document.getElementById('canvas1');
    var dataURL = c.toDataURL();
    var name = 'image';
    download(dataURL, name + ".png");
    var c = document.getElementById('canvas2');
    var dataURL = c.toDataURL();
    var name = 'image';
    download(dataURL, name + ".png");
}

function setBg(bgUrl) {
    if (mainCanvas.bg) {
        mainCanvas.bg.remove();
    }
    var imgObj = new Image();
    imgObj.setAttribute('crossOrigin', 'anonymous');
    imgObj.src = bgUrl;
    imgObj.onload = function () {
        var img = new fabric.Image(imgObj);
        img.id = 'bg';
        img.scaleToWidth(mainCanvas.width);
        img.selectable = false;
        mainCanvas.add(img);
        mainCanvas.bg = img;
        setZIndexes();
    }
}

function setFrame(frameUrl) {
    if (mainCanvas.frame) {
        mainCanvas.frame.remove();
    }
    var imgObj = new Image();
    imgObj.setAttribute('crossOrigin', 'anonymous');
    imgObj.src = frameUrl;
    imgObj.onload = function () {
        var img = new fabric.Image(imgObj);
        img.id = 'frame';
        img.left = 325;
        img.top = 72;
        img.scaleToHeight(280);
        img.selectable = false;
        mainCanvas.add(img);
        if (mainCanvas.pic) {
            mainCanvas.pic.left = img.left + 2 * padding;
            mainCanvas.pic.top = img.top + 2 * padding;
            mainCanvas.pic.scaleToWidth(img.getWidth() - 4 * padding);
            mainCanvas.renderAll();
        }
        mainCanvas.frame = img;
        setZIndexes();
    }
}

function setAccent(accentUrl) {
    var imgObj = new Image();
    imgObj.setAttribute('crossOrigin', 'anonymous');
    imgObj.src = accentUrl;
    imgObj.onload = function () {
        var img = new fabric.Image(imgObj);
        img.id = 'accent';
        img.left = 60;
        img.top = 205;
        mainCanvas.add(img);
        mainCanvas.accents.push(img);
        setZIndexes();
    }
}

function setZIndexes(canvas = null) {
    var curr_zIndex = 0;
    if (canvas === null) {
        canvas = mainCanvas;
    }

    if (canvas.bg) {
        canvas.bg.moveTo(curr_zIndex++);
    }

    if (canvas.accents) {
        canvas.accents.forEach(function (accent) {
            accent.moveTo(curr_zIndex++);
        });
    }

    if (canvas.pic) {
        canvas.pic.moveTo(curr_zIndex++);
    }

    if (canvas.frame) {
        canvas.frame.moveTo(curr_zIndex++);
    }

    canvas.getObjects().forEach(function (obj) {
        if (obj.isType('i-text')) {
            obj.moveTo(curr_zIndex++);
        }
    });
}

function clearCanvas(canvas) {
    canvas.clear();
    canvas.bg = null;
    canvas.frame = null;
    canvas.pic = null;
    canvas.accents = [];
}

function loadJsonIntoCanvas(json, canvas, ignoreAddedEvent = false) {
    clearCanvas(canvas);
    fabric.util.enlivenObjects(json, function (objects) {
        objects.forEach(function (obj) {
            if (obj.id) {
                if (obj.id === 'bg') {
                    canvas.bg = obj;
                } else if (obj.id === 'frame') {
                    canvas.frame = obj;
                } else if (obj.id === 'pic') {
                    canvas.pic = obj;
                } else if (obj.id === 'accent') {
                    canvas.accents.push(obj);
                }
            }

            if (ignoreAddedEvent) {
                obj.ignoreAddedEvent = true;
            }
            canvas.add(obj);
            setZIndexes(canvas);
            canvas.renderAll.bind(canvas);
        });
    });
}

function updateCanvasState(canvas, config) {
    if ((config.undoStatus === false && config.redoStatus === false)) {
        var jsonData = canvas.toJSON(['selectable', 'id']);
        var canvasAsJson = JSON.stringify(jsonData);
        if (config.currentStateIndex < config.canvasState.length - 1) {
            var indexToBeInserted = config.currentStateIndex + 1;
            config.canvasState[indexToBeInserted] = canvasAsJson;
            var numberOfElementsToRetain = indexToBeInserted + 1;
            config.canvasState = config.canvasState.splice(0, numberOfElementsToRetain);
        } else {
            config.canvasState.push(canvasAsJson);
        }
        config.currentStateIndex = config.canvasState.length - 1;
        if ((config.currentStateIndex === config.canvasState.length - 1) && config.currentStateIndex != -1) {
            $('#redo').prop('disabled', true);
        }
        $('#undo').prop('disabled', false);
    }
}

function updateMementoButtons() {
    if ((mainCanvas.mementoConfig.currentStateIndex === mainCanvas.mementoConfig.canvasState.length - 1) || (mainCanvas.mementoConfig.currentStateIndex === -1 && mainCanvas.mementoConfig.canvasState.length === 0)) {
        $('#redo').prop('disabled', true);
    } else {
        $('#redo').prop('disabled', false);
    }

    if (mainCanvas.mementoConfig.currentStateIndex > -1) {
        $('#undo').prop('disabled', false);
    } else {
        $('#undo').prop('disabled', true);
    }
}

function deleteActiveObject() {
    var activeObject = mainCanvas.getActiveObject(),
        activeGroup = mainCanvas.getActiveGroup();
    if (activeObject) {
        if (confirm("Sure you want to delete that?")) {
            mainCanvas.remove(activeObject);
        }
    } else if (activeGroup) {
        if (confirm("Sure you want to delete that?")) {
            var objectsInGroup = activeGroup.getObjects();
            mainCanvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                mainCanvas.remove(object);
            });
        }
    }
}

$(function () {

    $viewText = document.querySelector("#viewText");
    canvas1 = new fabric.Canvas('canvas1');
    canvas1.accents = [];
    canvas1.mementoConfig = canvas1Config;
    canvas1.on('object:modified', function () {
        updateCanvasState(canvas1, canvas1Config);
    });
    canvas1.on('object:added', function (e) {
        if (!e.target.ignoreAddedEvent) {
            updateCanvasState(canvas1, canvas1Config);
        }
    });
    canvas2 = new fabric.Canvas('canvas2');
    canvas2.accents = [];
    canvas2.mementoConfig = canvas2Config;
    canvas2.on('object:modified', function () {
        updateCanvasState(canvas2, canvas2Config);
    });
    canvas2.on('object:added', function (e) {
        if (!e.target.ignoreAddedEvent) {
            updateCanvasState(canvas2, canvas2Config);
        }
    });
    changeView(1);

    // canvas2json
    $("#canvas2json").click(function () {
        var json = {};
        json.c1 = canvas1.toJSON(['selectable', 'id']);
        json.c2 = canvas2.toJSON(['selectable', 'id']);
        $("#myTextArea").text(JSON.stringify(json));
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(json)], {
            type: 'text/plain'
        });
        var url = URL.createObjectURL(file);
        var name = 'json.txt';
        download(url, name);
    });

    // load json2canvas
    $("#loadJson2Canvas").click(function () {
        var dataToLoad = JSON.parse($("#myTextArea").val());

        canvas1.loadFromJSON(
            dataToLoad.c1,
            canvas1.renderAll.bind(canvas1),
            function (o, object) {
                console.log(o, object)
            });
        canvas2.loadFromJSON(
            dataToLoad.c2,
            canvas2.renderAll.bind(canvas2),
            function (o, object) {
                console.log(o, object)
            });


    });

    $('#jsonload').change(function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (f) {
            var data = f.target.result;
            data = JSON.parse(data);

            loadJsonIntoCanvas(data.c1.objects, canvas1);
            loadJsonIntoCanvas(data.c2.objects, canvas2);
        };
        reader.readAsText(file);
    });
    $(this).val(null);

    // Bleed area
    mainCanvas.on('object:moving', function (e) {
        var obj = e.target;

        // if object is too big ignore
        if (obj.currentHeight > obj.canvas.height - padding * 2 ||
            obj.currentWidth > obj.canvas.width - padding * 2) {
            return;
        }
        obj.setCoords();

        // top-left corner
        if (obj.getBoundingRect().top < padding ||
            obj.getBoundingRect().left < padding) {
            obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top + padding);
            obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left + padding);
        }

        // bot-right corner
        if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height - padding ||
            obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width - padding) {
            obj.top = Math.min(
                obj.top,
                obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top - padding);
            obj.left = Math.min(
                obj.left,
                obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left - padding);
        }
    });

    $("#save").click(save);

    // Print
    $("#print").click(function () {
        mainCanvas.deactivateAll().renderAll();
        var dataUrl1 = document.getElementById('canvas1').toDataURL();
        var dataUrl2 = document.getElementById('canvas2').toDataURL();
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>';
        windowContent += '<head><title>Print</title>';
        windowContent += '<style>@media print{.page-break{display:block; page-break-before:always;}}</style>';
        windowContent += '</head>';
        windowContent += '<body>';
        windowContent += '<img src="' + dataUrl1 + '" onload=window.print();window.close();>';
        windowContent += '<div class="page-break"></div>';
        windowContent += '<img src="' + dataUrl2 + '" onload=window.print();window.close();>';
        windowContent += '</body>';
        windowContent += '</html>';
        var printWin = window.open('', '', 'width=340,height=260');
        printWin.document.open();
        printWin.document.write(windowContent);
    });

    //Add Image From Computer
    document.getElementById('imgLoader').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var imgObj = new Image();
            imgObj.setAttribute('crossOrigin', 'anonymous');
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                if (mainCanvas.pic) {
                    mainCanvas.pic.remove();
                }
                var image = new fabric.Image(imgObj);
                mainCanvas.pic = image;
                image.id = 'pic';
                if (mainCanvas.frame) {
                    image.left = mainCanvas.frame.left + 2 * padding;
                    image.top = mainCanvas.frame.top + 2 * padding;
                    image.scaleToWidth(mainCanvas.frame.getWidth() - 4 * padding);
                } else {
                    image.set({
                        left: 360,
                        top: 102,
                        selectable: true,
                    }).scaleToHeight(220);
                }
                image.on('moving', function (e) {
                    if (!mainCanvas.frame) {
                        return;
                    }
                    image.setCoords();
                    var iRect = image.getBoundingRect();
                    if (!(iRect.left >= mainCanvas.frame.oCoords.tl.x && mainCanvas.frame.oCoords.br.x >= iRect.left + iRect.width)) {
                        image.left = image.lastLeft;
                    } else {
                        image.lastLeft = image.left;
                    }
                    if (!(mainCanvas.frame.oCoords.br.y >= iRect.top + iRect.height && iRect.top >= mainCanvas.frame.oCoords.tl.y)) {
                        image.top = image.lastTop;
                    } else {
                        image.lastTop = image.top;
                    }
                });
                image.on('scaling', function (e) {
                    if (!mainCanvas.frame) {
                        return;
                    }
                    var maxScaleX = (mainCanvas.frame.getWidth() - 4 * padding) / this.width;
                    var maxScaleY = (mainCanvas.frame.getHeight() - 4 * padding) / this.height;
                    if (this.scaleX > maxScaleX) {
                        this.scaleX = maxScaleX;
                        this.left = this.lastGoodLeft;
                        this.top = this.lastGoodTop;
                    }
                    if (this.scaleY > maxScaleY) {
                        this.scaleY = maxScaleY;
                        this.left = this.lastGoodLeft;
                        this.top = this.lastGoodTop;
                    }
                    this.lastGoodTop = this.top;
                    this.lastGoodLeft = this.left;
                });
                mainCanvas.add(image);
                setZIndexes();
                mainCanvas.renderAll();
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    $('#bg1').click(function () {
        setBg('https://images.unsplash.com/photo-1515017371642-d0cc17ccdb4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3349f3bdeaf8d3984e5b9a0e4d5ab1ca&auto=format&fit=crop&w=1000&q=60');
    });

    $('#bg2').click(function () {
        setBg('https://images.unsplash.com/photo-1438979087584-602939abfd2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=af76e0e3f8dd5e2d18cc9abfb63d9209&auto=format&fit=crop&w=1000&q=60');
    });

    $('#frame1').click(function () {
        setFrame('https://i.imgur.com/MdX89Ix.png');
    });

    $('#frame2').click(function () {
        setFrame('https://i.imgur.com/JMKASh4.png');
    });

    $('#accent1').click(function () {
        setAccent('https://images.unsplash.com/photo-1529096117001-6d01d3bcaae7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a27432a370cc564aaa82d7c3f1e38031&auto=format&fit=crop&w=250&q=60');
    });

    $('#accent2').click(function () {
        setAccent('https://images.unsplash.com/photo-1521158611-6b569322677d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=12bfcbf03e57cc99472bfb4f99541487&auto=format&fit=crop&w=250&q=60');
    });

    $('#undo').click(function () {
        if (mainCanvas.mementoConfig.undoFinishedStatus) {
            if (mainCanvas.mementoConfig.currentStateIndex === -1) {
                mainCanvas.mementoConfig.undoStatus = false;
            } else {
                if (mainCanvas.mementoConfig.canvasState.length >= 1) {
                    mainCanvas.mementoConfig.undoFinishedStatus = 0;
                    if (mainCanvas.mementoConfig.currentStateIndex != 0) {
                        mainCanvas.mementoConfig.undoStatus = true;
                        loadJsonIntoCanvas(JSON.parse(mainCanvas.mementoConfig.canvasState[mainCanvas.mementoConfig.currentStateIndex - 1]).objects, mainCanvas, true);
                        mainCanvas.mementoConfig.undoStatus = false;
                        mainCanvas.mementoConfig.currentStateIndex -= 1;
                        $('#undo').prop('disabled', false);
                        if (mainCanvas.mementoConfig.currentStateIndex !== mainCanvas.mementoConfig.canvasState.length - 1) {
                            $('#redo').prop('disabled', false);
                        }
                        mainCanvas.mementoConfig.undoFinishedStatus = 1;
                    } else if (mainCanvas.mementoConfig.currentStateIndex === 0) {
                        clearCanvas(mainCanvas);
                        mainCanvas.mementoConfig.undoFinishedStatus = 1;
                        $('#undo').prop('disabled', true);
                        $('#redo').prop('disabled', false);
                        mainCanvas.mementoConfig.currentStateIndex -= 1;
                    }
                }
            }
        }
    });

    $('#redo').click(function () {
        if (mainCanvas.mementoConfig.redoFinishedStatus) {
            if ((mainCanvas.mementoConfig.currentStateIndex === mainCanvas.mementoConfig.canvasState.length - 1) && mainCanvas.mementoConfig.currentStateIndex != -1) {
                $('#redo').prop('disabled', true);
            } else {
                if (mainCanvas.mementoConfig.canvasState.length > mainCanvas.mementoConfig.currentStateIndex && mainCanvas.mementoConfig.canvasState.length != 0) {
                    mainCanvas.mementoConfig.redoFinishedStatus = 0;
                    mainCanvas.mementoConfig.redoStatus = true;
                    loadJsonIntoCanvas(JSON.parse(mainCanvas.mementoConfig.canvasState[mainCanvas.mementoConfig.currentStateIndex + 1]).objects, mainCanvas, true);
                    mainCanvas.mementoConfig.redoStatus = false;
                    mainCanvas.mementoConfig.currentStateIndex += 1;
                    if (mainCanvas.mementoConfig.currentStateIndex != -1) {
                        $('#undo').prop('disabled', false);
                    }
                    mainCanvas.mementoConfig.redoFinishedStatus = 1;
                    if ((mainCanvas.mementoConfig.currentStateIndex === mainCanvas.mementoConfig.canvasState.length - 1) && mainCanvas.mementoConfig.currentStateIndex != -1) {
                        $('#redo').prop('disabled', true);
                    }
                }
            }
        }
    });

    // Delete
    $("#delete").click(deleteActiveObject);

    $("body").on("keydown", function (e) {
        if (e.which == 8 || e.which == 46) {
            deleteActiveObject();
        }
    });

});