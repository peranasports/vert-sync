import { useEffect, useRef, useState } from "react";
import { writeText, writeTextCentre } from "../utils/Utils";
import { UsersIcon } from "@heroicons/react/20/solid";

function MatchJumpsChart({ vobj }) {
  const canvasRef = useRef(null);
  const ref = useRef(null);

  const draw = (ctx, scale) => {
    const canvas = canvasRef.current;
    var w = canvas.width / 2;
    var xmargin = (canvas.width - w) / 2;
    var h = canvas.height / 2;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    if (vobj === null || vobj.jumps === undefined) {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const max = vobj.maxjumps * 1.2;
    const sx = h / max;
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, h - vobj.jumps.length * sx, w, vobj.jumps.length * sx);
    ctx.fillStyle = "pink";
    ctx.fillRect(
      0,
      h - vobj.jumpevents.length * sx,
      w,
      vobj.jumpevents.length * sx
    );

    writeText(
      {
        ctx: ctx,
        text: vobj.jumps.length,
        x: 0,
        y: h - vobj.jumps.length * sx - 15,
        width: w,
      },
      {
        textAlign: "left",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 15,
        color: "blue",
      }
    );

    writeText(
        {
          ctx: ctx,
          text: vobj.jumpevents.length,
          x: 30,
          y: h - vobj.jumps.length * sx - 15,
          width: w,
        },
        {
          textAlign: "left",
          fontFamily: "Arial",
          fontWeight: "bold",
          fontSize: 15,
          color: "red",
        }
      );
  
    //   ctx.fillStyle = "red";
    //   ctx.fillRect(20, 20, w - 40, h - 40);

    const starttime = vobj.jumps[0].timesecs;
    var totaltime = vobj.jumps[vobj.jumps.length - 1].timesecs - starttime;
    var xscale = w / totaltime;
    var yscale = h / 2 / 100;
    var y = h;
    var x = 0;
    for (const jump of vobj.jumps) {
      var color = jump.event === null || jump.event === undefined ? "blue" : "red";
      var dy = y - jump.vertcms * yscale;
      var dx = x + xscale * (jump.timesecs - starttime);
      ctx.beginPath();
      ctx.moveTo(dx, y);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    var markerObj = new Image();
    markerObj.onload = function () {
      ctx.drawImage(markerObj, w - 24, 4);
    };
    markerObj.src = "../assets/Vert64.png";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 400; //320 * 2; //canvas.offsetWidth;
    canvas.height = 200; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // var scale = canvas.width / 2 / ((maxLat - minLat) * 100000);
    // scale = scale * 0.7;

    draw(context);
  }, [vobj]);

  const onMouseDown = (e) => {
    var x = e.nativeEvent.offsetX;
    var y = e.nativeEvent.offsetY;
  };
  return (
    <div ref={ref}>
      <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
    </div>
  );
}

export default MatchJumpsChart;
