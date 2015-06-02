# gamut-visualizer

Displays the gamut of an image in the HSB color space.

A gamut viewer is a useful tool that lets you see how artists work with color or just to analyze your own images. There are already a number of gamut visualizers available, but none of the ones I know of have any visual representation of the frequency in which a color is used, so I wrote my own.

The difference with other gamut visualizers is that the colors that are less used will be more transparent than the ones that are more frequently used. This allows you to have more information about color usage and helps you determine which zones of the color wheel have been used more in the image. 

To determine the transparency of a color a logarithmic scale is used to compensate the fact that the range of color frequencies is quite large while most of the colors appear very few times in an image.

The colors displayed on the color wheel have only two components from the HSB color model, hue and saturation, and the third component, brightness, is always 100%. This means that any color on the wheel can really appear with different brightness values in the image.

The gamut-visualizer script is in the paperscript format ([paper.js](http://paperjs.org)).

## Usage

Load index.html on your browser and drop images on the box.