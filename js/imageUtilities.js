function loadImage (inUrl, callback, inCanvas, inFillcolor) {
    /** Convert to array, so we may load multiple images at once */
    const aUrl = !Array.isArray(inUrl) ? [inUrl] : inUrl;
    const canvas = inCanvas && inCanvas instanceof HTMLCanvasElement
        ? inCanvas
        : document.createElement('canvas');
    var imgCount = aUrl.length - 1;
    const imgCache = {};

    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    for (let url of aUrl) {
        let image = new Image();
        let cnt = imgCount;
        let w = 144, h = 144;

        image.onload = function () {
            imgCache[url] = this;
            // look at the size of the first image
            if (url === aUrl[0]) {
                canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            }
            // if (Object.keys(imgCache).length == aUrl.length) {
            if (cnt < 1) {
                if (inFillcolor) {
                    ctx.fillStyle = inFillcolor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                // draw in the proper sequence FIFO
                aUrl.forEach(e => {
                    if (!imgCache[e]) {
                        console.warn(imgCache[e], imgCache);
                    }

                    if (imgCache[e]) {
                        ctx.drawImage(imgCache[e], 0, 0);
                        ctx.save();
                    }
                });

                callback(canvas.toDataURL('image/png'));
                // or to get raw image data
                // callback && callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
            }
        };

        imgCount--;
        image.src = url;
    }
};

function loadAndSetImage (context, imageNameOrArr, color) {
	if (!color) {
		color = false;
	}
    loadImage(imageNameOrArr, function (data) {
        var json = {
            'event': 'setImage',
            'context': context,
            'payload': {
                'image': data,
                'target': 0
            }
        };
        websocket.send(JSON.stringify(json));
    }, false, color);
};