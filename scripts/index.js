var canvas, ctx, fileinput, container, img,
    prevX = 0,
    prevY = 0,
    currX = 0,
    currY = 0;

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    input = document.getElementById('imageLoader');
    container = document.getElementById('canvasContainer');
    img = new Image();
    colorCode = document.getElementById('colorCode');

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e);
    });

    canvas.addEventListener("click", function (e) {
        getRGBValue();
    });

    input.addEventListener("change", function (e) {
        showUploadedImage(e);
    });
}

function findxy(res, e) {
    if (res == 'move') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - container.offsetLeft;
        currY = e.clientY - container.offsetTop;
    }
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Make sure the img is loaded before 
                img.onload = function() {
                    // Calculate the scale of the canvas and image
                    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    var x = (canvas.width / 2) - (img.width / 2) * scale;
                    var y = (canvas.height / 2) - (img.height / 2) * scale;
                    
                    // Draw the image on the canvas
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                }
            }
        }

    } else {
        alert("What you uploaded there, was not an image.");
    }
}

function getRGBValue() {
    let imagedata = ctx.getImageData(currX, currY, canvas.width, canvas.height).data;
    let rgb = [ imagedata[0], imagedata[1], imagedata[2] ];
    colorCode.value = rgb;
}