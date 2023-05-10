// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(rgb) {
    var rHex = rgb.r.toString(16).padStart(2, '0');
    var gHex = rgb.g.toString(16).padStart(2, '0');
    var bHex = rgb.b.toString(16).padStart(2, '0');

    var hex = '#' + rHex + gHex + bHex;

    return hex;
}

function rgbToHsv(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;

    // Calculate the maximum and minimum values of RGB
    var cmax = Math.max(r, g, b);
    var cmin = Math.min(r, g, b);
    var delta = cmax - cmin;

    // Calculate hue value
    var h = 0;
    if (delta == 0) {
        h = 0;
    } else if (cmax == r) {
        h = ((g - b) / delta) % 6;
    } else if (cmax == g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    // Calculate saturation value
    var s = 0;
    if (cmax != 0) {
        s = delta / cmax;
    }

    // Calculate value (brightness) value
    var v = cmax;

    // Return HSV values as an object with 'h', 's', and 'v' properties
    return { h: h, s: s, v: v };
}

function hsvToRgb(hsv) {
    var h = hsv.h / 60;

    // Calculate chroma and intermediate values
    var c = hsv.v * hsv.s;
    var x = c * (1 - Math.abs(h % 2 - 1));
    var m = hsv.v - c;

    // Calculate RGB values based on hue
    var r, g, b;
    if (h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r: r, g: g, b: b };
}