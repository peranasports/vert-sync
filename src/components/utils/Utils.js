import { PercentColours } from '../utils/PercentColours';

export function unzipBuffer(inputstr) {
    if (inputstr === undefined || inputstr.length === 0) {
        return null
    }
    // console.log('unzipBuffer buffer length', inputstr.length)
    const pako = require('pako');
    var b64Data = inputstr
    try {
        var strData = window.atob(b64Data);
    } catch (error) {
        return inputstr
    }
    var len = strData.length;
    var bytes = new Uint8Array(len);
    var j = 0;
    for (var i = 4; i < len; i++) {
        bytes[j] = strData.charCodeAt(i);
        j++;
    }
    var binData = new Uint8Array(bytes);
    try {
        var buffer = pako.inflate(binData, { to: 'string' });
    } catch (error) {
        // console.log('inflate', error)
        return null;
    }
    return buffer
}

export function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export function stringToPoint(s) {
    var a = s.split(",")
    if (a.length == 2) {
        var x = parseFloat(a[0])
        var y = parseFloat(a[1])
        return { x: x, y: y }
    }
    return null
}

export function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

// multiple formats (e.g. yyyy/mm/dd (ymd) or mm-dd-yyyy (mdy) etc.)
export function tryParseDateFromString(dateStringCandidateValue, format = "ymd") {
    const candidate = (dateStringCandidateValue || ``)
        .split(/[ :\-\/]/g).map(Number).filter(v => !isNaN(v));
    const toDate = () => {
        format = [...format].reduce((acc, val, i) => ({ ...acc, [val]: i }), {});
        const parts =
            [candidate[format.y], candidate[format.m] - 1, candidate[format.d]]
                .concat(candidate.length > 3 ? candidate.slice(3) : []);
        const checkDate = d => d.getDate &&
            ![d.getFullYear(), d.getMonth(), d.getDate()]
                .find((v, i) => v !== parts[i]) && d || undefined;

        return checkDate(new Date(Date.UTC(...parts)));
    };

    return candidate.length < 3 ? undefined : toDate();
}

export function writeText(info, style = {}) {
    const { ctx, text, x, y } = info;
    const {
      fontSize = 20,
      fontFamily = "Arial",
      fontWeight = "",
      color = "black",
      textAlign = "left",
      textBaseline = "top",
    } = style;
  
    ctx.beginPath();
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.stroke();
  }
  
  export function writeTextCentre(info, style = {}) {
    const { ctx, text, x, y, width } = info;
    const {
      fontSize = 20,
      fontFamily = "Arial",
      fontWeight = "",
      color = "black",
      textBaseline = "top",
    } = style;
  
    var textWidth = ctx.measureText(text).width;
    var xx = x + width / 2 - textWidth / 2;
  
    ctx.beginPath();
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    ctx.textAlign = "left";
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, xx, y);
    ctx.stroke();
  }
  
  export function writeTextWithLineBreak(info, style = {}) {
    const { ctx, text, x, y, width, height } = info;
    const {
      fontSize = 20,
      fontFamily = "Arial",
      fontWeight = "",
      color = "black",
      textBaseline = "top",
      textAlign = "left",
    } = style;
  
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
  
    let lines = [];
    let lineCount = 0;
    let tmpTxt = text.split(" ");
    lines[lineCount] = [];
    for(let t = 0; t < tmpTxt.length; t++){
      lines[lineCount].push(tmpTxt[t]);
      if(ctx.measureText(lines[lineCount].join(" "), ctx.font).width > width) {
        let lastItem = lines[lineCount].pop();
        lineCount++;
        lines[lineCount] = [lastItem];
      }
    }
  
    ctx.beginPath();
    let metrics = ctx.measureText(text, ctx.font);
    let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    const tx = (textAlign === "center") ? x + width / 2 : x
    const ty = (textBaseline === "center") ? y + (height - fontHeight * (lineCount + 1)) / 2 : y
    for(let l = 0; l < lines.length; l++) {
      ctx.fillText(lines[l].join(" "), tx, ty + (l * fontHeight));
    }
    ctx.stroke();
  }
    
export function zoneFromString(s)
{
    var bottommidpts = [ {x: 83.33, y:183.33}, {x: 83.33, y:116.67}, {x: 50, y:116.67}, {x: 16.67, y:116.67}, {x: 16.67, y:183.33}, {x: 50, y:183.33}, {x: 16.17, y:150}, {x: 50, y:150}, {x: 83.33, y:150} ];
    
    var topmidpts = [ {x: 16.67, y:16.67}, {x: 16.67, y:83.33}, {x: 50, y:83.33}, {x: 83.33, y:83.33}, {x: 83.33, y:16.67}, {x: 50, y:16.67}, {x: 16.67, y:50}, {x: 50, y:50}, {x: 83.33, y:50} ];

    var pt = stringToPoint(s)
    if (pt === null)
    {
        return 0;
    }
    for (var n=0; n<9; n++)
    {
        var xpt = bottommidpts[n];
        var r = makeRectPolygon(xpt.x - 16.66, xpt.y - 16.66, 33.33, 33.33);
        if (inside([pt.x, pt.y], r))
        {
            return n + 1;
        }
    }
    for (var n=0; n<9; n++)
    {
        var xpt = topmidpts[n];
        var r = makeRectPolygon(xpt.x - 16.66, xpt.y - 16.66, 33.33, 33.33);
        if (inside([pt.x, pt.y], r))
        {
            return n + 1;
        }
    }
    return 0;
}

export function makeRectPolygon(x, y, w, h)
{
    var polygon = []
    var pt = []
    pt.push(x)
    pt.push(y)
    polygon.push(pt)
    pt = []
    pt.push(x + w)
    pt.push(y)
    polygon.push(pt)
    pt = []
    pt.push(x + w)
    pt.push(y + h)
    polygon.push(pt)
    pt = []
    pt.push(x)
    pt.push(y + h)
    polygon.push(pt)
    return polygon
}

export function colourForEfficiency(eff)
{
    var x = Math.round(eff / 4) + 100
    var xx = LightenDarkenColor(PercentColours[x], 60)
    return '#' + xx
}

export function LightenDarkenColor(col, amt) {
    col = parseInt(col.substring(1, 7), 16);
    return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
}

export function replaceItemInArray(a, oldItem, newItem)
{
    var idx = a.indexOf(oldItem)
    if (idx === -1)
    {
        return a
    }
    else
    {
        var newa = []
        for (var n=0; n<a.length; n++)
        {
            if (n === idx)
            {
                newa.push(newItem)
            }
            else
            {
                newa.push(a[n])
            }
        }
        return newa
    }
}
  
export function saveToPC(fileData, filename) 
{
    // const fileData = JSON.stringify(contactsData);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename //bowlingObject.activityName + ".vss";
    link.href = url;
    link.click();
  };

export function dateToYYYYMMDD(dt)
{
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    return dt.getFullYear().toString() + zeroPad((dt.getMonth() + 1), 2) + zeroPad(dt.getDate(), 2);
}

export function dateToString(dt)
{
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    return zeroPad(dt.getDate(), 2) + "/"  + zeroPad((dt.getMonth() + 1), 2) + "/" + dt.getFullYear().toString();
}

export function matchScoresString(match)
{
    var s = match.HomeScore + "-" + match.AwayScore + " ("
    for (var nd=0; nd<match.sets.length; nd++)
    {
        if (nd > 0) s += ", "
        s += match.sets[nd].HomeScore + "-" + match.sets[nd].AwayScore
    }
    s += ")"
    return s
}

export function standardDeviation(arr)
{
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr)=>{
      return acc + curr
    }, 0) / arr.length;
     
    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k)=>{
      return (k - mean) ** 2
    })
     
    // Calculating the sum of updated array
   let sum = arr.reduce((acc, curr)=> acc + curr, 0);
    
   // Calculating the variance
   let variance = sum / arr.length
    
   // Returning the standard deviation
   return Math.sqrt(sum / arr.length)
  }

