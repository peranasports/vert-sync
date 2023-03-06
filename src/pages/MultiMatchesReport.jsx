import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initWithJumpObjects } from "../components/utils/VertStatsObject";
import { dateToString } from "../components/utils/Utils";
import {
  initWithXMLData,
  synchJumpsAndStats,
} from "../components/utils/VertFile";
import { initWithData } from "../components/utils/DVWFile";
import MatchJumpsChart from "../components/panels/MatchJumpsChart";
import { TableCellsIcon, VideoCameraIcon } from "@heroicons/react/20/solid";

function MultiMatchesReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { team, vssPackages } = location.state;
  const [, forceUpdate] = useState(0);
  const [allVertObjects, setAllVertObjects] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);

  const doReport = (vobjs, pl) => {
    const vobj = getPlayerVertObjectInMatch(vobjs, pl);
    if (vobj !== null) {
      const st = {
        match: vobjs.match,
        vertObject: vobj,
      };
      navigate("/vertstatsreport", { state: st });
    }
  };

  const doVideo = (vobjs, pl) => {
    const st = {
        match: vobjs.match,
        vertObjects: vobjs,
        onlineVideoFileUrl: vobjs.vssPackage.onlineVideoFileUrl,
        player:pl,
      };
      navigate("/videostatsvert", { state: st });
  };

  function compareTime(a, b) {
    if (a.match.TrainingDate.getTime() < b.match.TrainingDate.getTime()) {
      return -1;
    }
    if (a.match.TrainingDate.getTime() > b.match.TrainingDate.getTime()) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    var maxjumps = 0;
    var allvobjs = [];
    for (var vssPackage of vssPackages) {
      var m = initWithData(vssPackage.dvFileData);
      var vobjs = initWithXMLData(vssPackage.vertFileData);
      const opms = vssPackage.matchingNames;
      if (opms !== null) {
        for (var np = 0; np < vobjs.length; np++) {
          for (var no = 0; no < opms.length; no++) {
            if (opms[no].playerName === vobjs[np].playerName) {
              var ok = false;
              var allplayers = m.teamA.players.concat(m.teamB.players);
              for (var tapl = 0; tapl < allplayers.length; tapl++) {
                const pl = allplayers[tapl];
                if (
                  pl.FirstName + " " + pl.LastName ===
                  opms[no].selectedPlayerName
                ) {
                  vobjs[np].selectPlayer = pl;
                  ok = true;
                  break;
                }
              }
            }
          }
        }
      }
      synchJumpsAndStats(vobjs, m);

      for (const vobj of vobjs) {
        maxjumps = vobj.jumps.length > maxjumps ? vobj.jumps.length : maxjumps;
      }

      for (var np = 0; np < m.teamA.players.length; np++) {
        var pl = m.teamA.players[np];
        pl.isVert = false;
        for (var no = 0; no < vobjs.length; no++) {
          const vobj = vobjs[no];
          if (
            vobj.selectPlayer !== undefined &&
            vobj.selectPlayer.Guid === pl.Guid
          ) {
            pl.isVert = true;
            break;
          }
        }
      }
      for (var np = 0; np < m.teamB.players.length; np++) {
        var pl = m.teamB.players[np];
        pl.isVert = false;
        for (var no = 0; no < vobjs.length; no++) {
          const vobj = vobjs[no];
          if (
            vobj.selectPlayer !== undefined &&
            vobj.selectPlayer.Guid === pl.Guid
          ) {
            pl.isVert = true;
            break;
          }
        }
      }
      vobjs.match = m;
      vobjs.vssPackage = vssPackage
      allvobjs.push(vobjs);
    }
    var allvertplayers = {};
    for (const vos of allvobjs) {
      for (const vo of vos) {
        vo.maxjumps = maxjumps;
        if (vo.selectPlayer !== undefined) {
          if (allvertplayers[vo.playerName] === undefined) {
            allvertplayers[vo.playerName] = vo.selectPlayer;
          }
        }
      }
    }
    var avps = [];
    for (var prop in allvertplayers) {
      avps.push(allvertplayers[prop]);
    }
    allvobjs.sort(compareTime);
    setAllVertObjects(allvobjs);
    avps.sort((a, b) => a.LastName.localeCompare(b.LastName));
    setAllPlayers(avps);
  }, [vssPackages]);

  const getPlayerVertObjectInMatch = (vobjs, pl) => {
    for (const vobj of vobjs) {
      if (
        vobj.selectPlayer.FirstName === pl.FirstName &&
        vobj.selectPlayer.LastName === pl.LastName
      ) {
        return vobj;
      }
    }
    return null;
  };

  const getOppositionName = (vobjs) => {
    console.log(vobjs)
    console.log(vobjs.match)
    console.log(vobjs.match.teamA)
    console.log(vobjs.match.teamB)
    if (vobjs.match.teamA.Name === team.Name) return vobjs.match.teamB.Name;
    else return vobjs.match.teamA.Name;
  };

  const getVertStatsForPlayerInMatch = (pl, vobjs) => {
    for (const vobj of vobjs) {
      if (
        vobj.selectPlayer.FirstName === pl.FirstName &&
        vobj.selectPlayer.LastName === pl.LastName
      ) {
        return vobj.jumps.length;
      }
    }
    return "-";
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              {allVertObjects.map((vobjs, idx) => (
                <th className="w-[15vw]">
                  <p className="text-center text-warning">{getOppositionName(vobjs)}</p>
                  <p className="text-center">
                    {dateToString(vobjs.match.TrainingDate)}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPlayers.map((pl, idx) => (
              <tr>
                <th>
                  {pl.shirtNumber}. {pl.FirstName.toUpperCase()} {pl.LastName.toUpperCase()}
                </th>
                {allVertObjects.map((vobjs, idxx) => (
                  <th key={idxx}>
                    <div className="flex gap-2 mr-1 justify-end">
                      <VideoCameraIcon
                        className="h-5 w-5"
                        onClick={() => doVideo(vobjs, pl)}
                      />
                      <TableCellsIcon
                        className="h-5 w-5"
                        onClick={() => doReport(vobjs, pl)}
                      />
                    </div>
                    <div className="overflow-y-auto w-[15vw] h-[15vh]">
                      <MatchJumpsChart
                        style={{ width: "200px" }}
                        vobj={getPlayerVertObjectInMatch(vobjs, pl)}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MultiMatchesReport;
