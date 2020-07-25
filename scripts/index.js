var canvas, backcan, ctx, fileinput, container, img, rgbColorCode, hexColorCode
    prevX = 0,
    prevY = 0,
    currX = 0,
    currY = 0;

$(document).ready(function () {
    canvas = document.getElementById('can');
    backcan = document.getElementById('backcan');
    ctx = canvas.getContext("2d");
    backctx = backcan.getContext("2d");
    container = document.getElementById('canvasContainer');
    img = new Image();
    rgbColorCode = document.getElementById('rgbColorCode');
    hexColorCode = document.getElementById('hexColorCode');

    // Event Listeners
    $('#can').on("mousemove", function (e) {
        findxy('move', e);
    });
    
    $('#can').on('mousedown touchstart', MouseDown);
    $('#can').on('mousedown touchstart', DragMouse);

    $('#can').on('mouseup touchend', function () {
        $('#can').off('mousemove touchmove', DragMouse);
        $('#can').off('mousemove touchmove', getRGBValue);
    });

    $('#imageLoader').on("change", function (e) {
        showUploadedImage(e);
    });
});

function findxy(res, e) {
    if (res == 'move') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - container.offsetLeft;
        currY = e.clientY - container.offsetTop;
    }
}

function MouseDown() {
    // While the mouse is down, call these functions
    $('#can').on('mousemove touchmove', DragMouse);
    $('#can').on('mousemove touchmove', getRGBValue);
}

function DragMouse(e) {
    // While the mouse is being dragged, draw the crosshair
    var mx = currX;
    var my = currY;

    if (isNaN(mx)) {
        mx = e.originalEvent.touches[0].pageX;
        my = e.originalEvent.touches[0].pageY;
    }

    drawCrossHair(mx, my);
}

function drawCrossHair(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // H 
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(0, y - 1);
    ctx.lineTo(500, y + 1);
    ctx.stroke();

    // V
    ctx.beginPath();
    ctx.moveTo(x - 1, 0);
    ctx.lineTo(x + 1, 500);
    ctx.stroke();
}

function showUploadedImage(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (file.type.match('image.*')) {
        var reader = new FileReader();

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                // Get image from uploaded file  
                img.src = evt.target.result;
                // Clear the canvas
                backctx.clearRect(0, 0, canvas.width, canvas.height);

                // Make sure the img is loaded before 
                img.onload = function () {
                    // Calculate the scale of the canvas and image
                    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    var x = (canvas.width / 2) - (img.width / 2) * scale;
                    var y = (canvas.height / 2) - (img.height / 2) * scale;

                    // Draw the image on the canvas
                    backctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                }
            }
        }

    } else {
        alert("What you uploaded there, was not an image.");
    }
}

function getRGBValue() {
    let imagedata = backctx.getImageData(currX, currY, canvas.width, canvas.height).data;
    let rgb = [imagedata[0], imagedata[1], imagedata[2]];

    let hex = [];
    let resultHex = "";
    for (let i = 0; i < 3; i++) {
        hex.push(Number(rgb[i]).toString(16));
        if (hex[i].length < 2) {
            hex[i] = "0" + hex[i];
        }

        // Build the resulting string
        resultHex += hex[i];
    }

    rgbColorCode.value = rgb;
    hexColorCode.value = resultHex;
}

// Prevent default code for touchscreens
window.blockMenuHeaderScroll = false;
$(window).on('touchstart', function (e) {
    if ($(e.target).closest('#can').length == 1) {
        blockMenuHeaderScroll = true;
    }
});
$(window).on('touchend', function () {
    blockMenuHeaderScroll = false;
});
$(window).on('touchmove', function (e) {
    if (blockMenuHeaderScroll) {
        e.preventDefault();
    }
});