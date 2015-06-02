/*
 * gamut_visualizer.js
 *
 * Copyright (c) 2015, Roger Tallada
 * http://rogertallada.com
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

function log10(val) {
    return Math.log(val) / Math.LN10;
}

function newHitMatrix(width, height) {
    var x, y, matrix;

    console.log('Setup the hit matrix.');
    matrix = [];
    for (y = 0; y < height; y = y + 1) {
        matrix[y] = [];
        for (x = 0; x < width; x = x + 1) {
            matrix[y][x] = {
                hits: 0,
                color: null
            };
        }
    }
    return matrix;
}

function alphaUsingLog(value, maxValue, exp) {
    var alpha, valueByMax, largeNumber = Math.pow(10, exp);

    valueByMax = value / maxValue * largeNumber;
    alpha = log10(valueByMax) / log10(largeNumber);

    return alpha;
}

function getColorsFrequency(image, wheelRadius) {
    var freq, x, y, color, hsbColor, distance, vector, newColor, pixel;

    console.log('Calculating color frequency...');

    freq = {};
    freq.maxHits = 0;
    freq.totalColors = 0;
    freq.hitMatrix = newHitMatrix(wheelRadius * 2, wheelRadius * 2);

    for (y = 0; y < image.height; y = y + 1) {
        for (x = 0; x < image.width; x = x + 1) {
            // Get the color of the pixel:
            color = image.getPixel(x, y);
            hsbColor = color.convert('hsb');
            distance = hsbColor.saturation * (wheelRadius - 1);
            vector = new Point(0, distance);
            vector.angle = hsbColor.hue;

            newColor = hsbColor.clone();
            newColor.brightness = 1;

            pixel = new Point(vector.floor() + new Point(wheelRadius, wheelRadius));

            if (freq.hitMatrix[pixel.y][pixel.x].hits === 0) {
                freq.totalColors = freq.totalColors + 1;
            }

            freq.hitMatrix[pixel.y][pixel.x].hits = freq.hitMatrix[pixel.y][pixel.x].hits + 1;
            freq.hitMatrix[pixel.y][pixel.x].color = newColor.clone();

            if (freq.hitMatrix[pixel.y][pixel.x].hits > freq.maxHits) {
                freq.maxHits = freq.hitMatrix[pixel.y][pixel.x].hits;
            }
        }
    }

    return freq;
}

function displayGamut(freqs, wheelRadius) {
    var x, y, pixel, pixelRect, pixelSize = new Size(1, 1);

    console.log('Showing the gamut.');
    for (y = 0; y < wheelRadius * 2; y = y + 1) {
        for (x = 0; x < wheelRadius * 2; x = x + 1) {
            if (freqs.hitMatrix[y][x].hits > 0) {
                pixel = new Point(x, y);
                pixelRect = new Path.Rectangle(pixel, pixelSize);

                freqs.hitMatrix[y][x].color.alpha = alphaUsingLog(freqs.hitMatrix[y][x].hits, freqs.maxHits, 4);
                pixelRect.fillColor = freqs.hitMatrix[y][x].color;
            }
        }
    }
}

// Inject a global object to be able to call clear() and to set some variables from javascript.
window.paperscript = {};

paperscript.clear = function () {
    project.clear();
    paper.view.draw();
};

// Change these from javascript if needed:
paperscript.backgroundColor = "white";
paperscript.radius = 150;

// Setting the "onload" event here ensures that paper.js is already loaded.
var theimage = document.getElementById('theimage');
theimage.onload = function() {
    var newHeight, newWidth, newSize, background, blackWheel, frequencies, msg;
    var center = new Point(paperscript.radius, paperscript.radius);
    var raster = new Raster('theimage');

    console.log('--- refresh ---');
    if (raster.size.width >= raster.size.height) {
        if (raster.size.width > paperscript.radius * 2) {
            newHeight = raster.size.height * (paperscript.radius * 2 / raster.size.width);
            newSize = new Size(paperscript.radius * 2, newHeight);
            raster.size = newSize;
        }
    } else {
        if (raster.size.height > paperscript.radius * 2) {
            newWidth = raster.size.width * (paperscript.radius * 2 / raster.size.height);
            newSize = new Size(newWidth, paperscript.radius * 2);
            raster.size = newSize;
        }
    }

    background = new Path.Rectangle(new Point(), new Size(paperscript.radius * 2, paperscript.radius * 2));
    background.fillColor = paperscript.backgroundColor;

    blackWheel = new Path.Circle(center, paperscript.radius);
    blackWheel.fillColor = 'black';

    frequencies = getColorsFrequency(raster, paperscript.radius);

    displayGamut(frequencies, paperscript.radius);    
    
    msg = document.getElementById('message');
    msg.style.display = 'none';
};
