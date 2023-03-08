import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initWithJumpObjects } from "../components/utils/VertStatsObject";
import { dateToString } from "../components/utils/Utils";

function VertStatsReport() {
  const location = useLocation();
  const { match, vertObject } = location.state;
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    var stobjs = [];
    var vpobj = vertObject;
    var pl = vpobj.selectPlayer;
    var vsobjs = [];
    var mjumps = [];
    for (var nd = 0; nd < match.sets.length; nd++) {
      var d = match.sets[nd];
      if (d.events.length == 0) continue;

      const evs = d.events;
      const firstev = evs[0];
      const lastev = evs[evs.length - 1];
      var startts = firstev.TimeStamp.getTime() / 1000 - vpobj.threshold;
      var endts = lastev.TimeStamp.getTime() / 1000 + vpobj.threshold;

      if (vpobj.vertStartTime === undefined)
      {
        continue
      }
      var nn = 1;
      var ajumps = [];
      for (var nv = 0; nv < vpobj.jumps.length; nv++) {
        var viobj = vpobj.jumps[nv];
        const timeStamp = new Date(
          vpobj.vertStartTime.getTime() + viobj.timesecs * 1000
        );
        var timesince1970 = timeStamp.getTime() / 1000;
        if (timesince1970 >= startts && timesince1970 <= endts) {
          ajumps.push(viobj);
          mjumps.push(viobj);
        }
        nn++;
      }

      var obj = initWithJumpObjects(ajumps);
      for (var ne = 0; ne < evs.length; ne++) {
        var e = evs[ne];
        const isScrimmagePlayer =
          (e.Player != null &&
            pl.LastName === e.Player.LastName &&
            pl.FirstName === e.Player.FirstName) ||
          (pl != null &&
            pl.LastName === e.Player.LastName &&
            pl.FirstName === e.Player.FirstName);
        if (
          (e.EventType === 3 || e.EventType === 20) &&
          (e.Player == pl || isScrimmagePlayer)
        ) {
          obj.setCountTotal++;
        }
      }
      obj.set = d;
      obj.player = pl;
      vsobjs.push(obj);
    }
    var mobj = initWithJumpObjects(mjumps);
    mobj.match = match;
    mobj.player = pl;
    mobj.set = null;
    var mevs = match.events;
    for (var ne = 0; ne < mevs.length; ne++) {
        const e = mevs[ne]
      const isScrimmagePlayer =
        (e.Player != null &&
          pl.LastName === e.Player.LastName &&
          pl.FirstName === e.Player.FirstName) ||
        (pl != null &&
          pl.LastName === e.Player.LastName &&
          pl.FirstName === e.Player.FirstName);
      if (
        (e.EventType === 3 || e.EventType === 20) &&
        (e.Player == pl || isScrimmagePlayer)
      ) {
        mobj.setCountTotal++;
      }
    }
    vsobjs.push(mobj);
    vpobj.statsObjects = vsobjs;
    forceUpdate((n) => !n);
  }, [vertObject]);

  const landingTextColour = (total, count) => {
    const ave = count === 0 ? 0 : total / count
    if (ave < 10) return "text-success"    
    else if (ave < 20) return "text-warning"    
    else return "text-error"
  }

  const averageString = (total, count) => {
    if (total === undefined || count === undefined) return "-"
    if (total === 0) return "-";
    else
      return (
        (total / count).toFixed(1).toString() + " (" + count.toString() + ")"
      );
  };

  if (vertObject.statsObjects === undefined || match === undefined) {
    return <></>;
  }

  return (
    <>
        <div className="flex justify-between bg-primary">
            <div className="mx-2 flex-col">
            <div className="text-lg font-semibold">{vertObject.selectPlayer.FirstName}</div>
            <div className="text-xl font-bold">{vertObject.selectPlayer.LastName.toUpperCase()}</div>
            </div>
        <div className="mx-2 flex-col">
        <div className="text-md font-semibold">{match.teamA.Name.toUpperCase()} vs {match.teamB.Name.toUpperCase()}</div>
        <div className="text-md text-right">{dateToString(match.TrainingDate)}</div>
        </div>
        </div>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              {match.sets.map((s, idx) => (
                <th key={idx}>Set {idx + 1}</th>
              ))}
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
              <tr><th className="font-light text-warning">SPIKING</th></tr>
            <tr>
              <th>Spike Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(vobj.spikeJumpTotal, vobj.spikeCountTotal)}
                </th>
              ))}
            </tr>
            <tr>
              <th>Spike Kill Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.spikeJumpKillTotal,
                    vobj.spikeCountKillTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Spike Error Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.spikeJumpErrorTotal,
                    vobj.spikeCountErrorTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Spike Blocked Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.spikeJumpBlockedTotal,
                    vobj.spikeCountBlockedTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Spike Jump Max / Std. Dev.</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.spikeJumpMaximum === undefined
                    ? "-"
                    : vobj.spikeJumpMaximum.toFixed(1)}{" "}
                  /{" "}
                  {vobj.spikeJumpStandardDeviation === undefined
                    ? "-"
                    : vobj.spikeJumpStandardDeviation.toFixed(1)}
                </th>
              ))}
            </tr>
            <tr>
            <th>Spike Jump Landing Impact</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                    <p className={landingTextColour(vobj.spikeLandingPeakGSTotal, vobj.spikeLandingCountTotal)}>
                    {averageString(vobj.spikeLandingPeakGSTotal, vobj.spikeLandingCountTotal)}
                    </p>
                </th>
              ))}
            </tr>
            <tr><th className="font-light text-warning">BLOCKING</th></tr>
            <tr>
              <th>Block Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(vobj.blockJumpTotal, vobj.blockCountTotal)}
                </th>
              ))}
            </tr>
            <tr>
              <th>Block Kill Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.blockJumpKillTotal,
                    vobj.blockCountKillTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Block Jump Max / Std. Dev.</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.blockJumpMaximum === undefined
                    ? "-"
                    : vobj.blockJumpMaximum.toFixed(1)}{" "}
                  /{" "}
                  {vobj.blockJumpStandardDeviation === undefined
                    ? "-"
                    : vobj.blockJumpStandardDeviation.toFixed(1)}
                </th>
              ))}
            </tr>
            <tr>
            <th>Block Jump Landing Impact</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                    <p className={landingTextColour(vobj.blockLandingPeakGSTotal, vobj.blockLandingCountTotal)}>
                    {averageString(vobj.blockLandingPeakGSTotal, vobj.blockLandingCountTotal)}
                    </p>
                </th>
              ))}
            </tr>
            <tr><th className="font-light text-warning">SERVING</th></tr>
            <tr>
              <th>Serve Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(vobj.serveJumpTotal, vobj.serveCountTotal)}
                </th>
              ))}
            </tr>
            <tr>
              <th>Serve Ace Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.serveJumpKillTotal,
                    vobj.serveCountKillTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Serve Error Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(
                    vobj.serveJumpErrorTotal,
                    vobj.serveCountErrorTotal
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Serve Jump Max / Std. Dev.</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.serveJumpMaximum === undefined
                    ? "-"
                    : vobj.serveJumpMaximum.toFixed(1)}{" "}
                  /{" "}
                  {vobj.serveJumpStandardDeviation === undefined
                    ? "-"
                    : vobj.serveJumpStandardDeviation.toFixed(1)}
                </th>
              ))}
            </tr>
            <tr>
            <th>Serve Jump Landing Impact</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                    <p className={landingTextColour(vobj.serveLandingPeakGSTotal, vobj.serveLandingCountTotal)}>
                    {averageString(vobj.serveLandingPeakGSTotal, vobj.serveLandingCountTotal)}
                    </p>
                </th>
              ))}
            </tr>
            <tr><th className="font-light text-warning">SETTING</th></tr>
            <tr>
              <th>Set Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>{averageString(vobj.setJumpTotal, vobj.setCountTotal)}</th>
              ))}
            </tr>
            <tr>
              <th>Set Jump Max / Std. Dev.</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.setJumpMaximum === undefined
                    ? "-"
                    : vobj.setJumpMaximum.toFixed(1)}{" "}
                  /{" "}
                  {vobj.setJumpStandardDeviation === undefined
                    ? "-"
                    : vobj.setJumpStandardDeviation.toFixed(1)}
                </th>
              ))}
            </tr>
            <tr>
              <th>Standing Set / Jump Set</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.setCountTotal === 0
                    ? ""
                    : vobj.setCountTotal -
                      vobj.setJumpCountTotal +
                      " / " +
                      vobj.setJumpCountTotal}
                </th>
              ))}
            </tr>
            <tr>
            <th>Set Jump Landing Impact</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                    <p className={landingTextColour(vobj.setLandingPeakGSTotal, vobj.setLandingCountTotal)}>
                    {averageString(vobj.setLandingPeakGSTotal, vobj.setLandingCountTotal)}
                    </p>
                </th>
              ))}
            </tr>
            <tr><th className="font-light text-warning">ACTION JUMPS</th></tr>
            <tr>
            <th>All Action Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(vobj.allJumpActionTotal, vobj.allJumpActionCountTotal)}
                </th>
              ))}
            </tr>
            <tr>
            <th>All Action Jump Maximum</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.allJumpActionMax}
                </th>
              ))}
            </tr>
            <tr><th className="font-light text-warning">ALL JUMPS</th></tr>
            <tr>
            <th>All Jump Average</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {averageString(vobj.allJumpTotal, vobj.allJumpCountTotal)}
                </th>
              ))}
            </tr>
            <tr>
            <th>All Jump Maximum</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                  {vobj.allJumpMax}
                </th>
              ))}
            </tr>
            <tr>
            <th>All Jump Landing Impact</th>
              {vertObject.statsObjects.map((vobj, idx) => (
                <th>
                    <p className={landingTextColour(vobj.allLandingPeakGSTotal, vobj.allLandingCountTotal)}>
                    {averageString(vobj.allLandingPeakGSTotal, vobj.allLandingCountTotal)}
                    </p>
                </th>
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              {match.sets.map((s, idx) => (
                <th key={idx}>Set {idx + 1}</th>
              ))}
              <th>Match</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default VertStatsReport;
