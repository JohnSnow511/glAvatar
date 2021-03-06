// utils
var Utils = Utils || {};
(function () {
    

    // Utils.getShaderSource = function(id) {
    //     return document.getElementById(id).textContent.replace(/^\s+|\s+$/g, '');
    // };

    function createShader(gl, source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    Utils.createProgram = function(gl, vertexShaderSource, fragmentShaderSource) {
        var program = gl.createProgram();
        var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        gl.attachShader(program, vshader);
        gl.deleteShader(vshader);
        gl.attachShader(program, fshader);
        gl.deleteShader(fshader);
        gl.linkProgram(program);

        var log = gl.getProgramInfoLog(program);
        if (log) {
            console.log(log);
        }

        log = gl.getShaderInfoLog(vshader);
        if (log) {
            console.log(log);
        }

        log = gl.getShaderInfoLog(fshader);
        if (log) {
            console.log(log);
        }

        return program;
    };

    var loadImage = Utils.loadImage = function(url, onload) {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        // img.onload = function() {
        //     onload(img);
        // };
        img.onload = onload;
        return img;
    };

    Utils.loadImages = function(urls, onload) {
        var imgs = [];
        var imgsToLoad = urls.length;

        function onImgLoad() {
            if (--imgsToLoad <= 0) {
                onload(imgs);
            }
        }

        for (var i = 0; i < imgsToLoad; ++i) {
            imgs.push(loadImage(urls[i], onImgLoad));
        }
    };



    // // merge scene gltf json
    // Utils.exportGltf = function(gltfs) {
    //     console.log(gltfs[0].json);
    // };

})();

export {Utils};