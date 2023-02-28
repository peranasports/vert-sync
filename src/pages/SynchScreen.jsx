import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initWithData } from "../components/utils/DVWFile";
import { initWithXMLData, synchJumpsAndStats } from "../components/utils/VertFile";

function SynchScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    dvFileData,
    vertFileData,
    videoFileUrl,
    videoFileName,
    onlineVideoFileUrl,
  } = location.state;
  const [match, setMatch] = useState(null);
  const [vertObjects, setVertObjects] = useState(null);
  const [selectedVertObject, setSelectedVertObject] = useState(null)
  const [, forceUpdate] = useState(0);


  const savePlayerMatching = (xvos) =>
  {
    const pm = localStorage.getItem("PlayerMatching")
    var opms = []
    if (pm !== null)
    {
        opms = JSON.parse(pm)
    }

    var vobjs = []
    for (var np=0; np<xvos.length; np++)
    {
        var exists = false
        for (var no=0; no<opms.length; no++)
        {
            if (opms[no].playerName === xvos[np].playerName)
            {
                opms[no].selectedPlayerName = xvos[np].selectPlayer.FirstName + " " + xvos[np].selectPlayer.LastName
                exists = true
                break
            }
        }
        if (exists === false)
        {
            if (xvos[np].selectPlayer !== undefined)
            {
                const opm = { playerName: xvos[np].playerName, selectedPlayerName: xvos[np].selectPlayer.FirstName + " " + xvos[np].selectPlayer.LastName}
                opms.push(opm)
            }
        }
    }
    localStorage.setItem("PlayerMatching", JSON.stringify(opms))    
  }

  const doVideoStatsVert = () => {
    savePlayerMatching(vertObjects)
    const st = {
      match: match,
      vertObjects: vertObjects,
      videoFileUrl: videoFileUrl,
      videoFileName: videoFileName,
      onlineVideoFileUrl: onlineVideoFileUrl,
    };
    navigate("/videostatsvert", { state: st });
  };

  const doSelectPlayer = (player) => {
    selectedVertObject.selectedPlayer = player
    forceUpdate((n) => !n)
    var xvos = []
    for (var np=0; np<vertObjects.length; np++)
    {
        var xvo = vertObjects[np]
        if (vertObjects[np].playerName === selectedVertObject.playerName)
        {
            xvo.selectPlayer = player
        }
        xvos.push(xvo)
    }
    savePlayerMatching(xvos)
  };

  useEffect(() => {
    var m = initWithData(dvFileData);
    setMatch(m);
    var vobjs = initWithXMLData(vertFileData);
    const pm = localStorage.getItem("PlayerMatching")
    var opms = []
    if (pm !== null)
    {
        opms = JSON.parse(pm)
        for (var np=0; np<vobjs.length; np++)
        {
            for (var no=0; no<opms.length; no++)
            {
                if (opms[no].playerName === vobjs[np].playerName)
                {
                    var ok = false
                    var allplayers = m.teamA.players.concat(m.teamB.players);
                    for (var tapl=0; tapl<allplayers.length; tapl++)
                    {
                        const pl = allplayers[tapl]
                        if (pl.FirstName + " " + pl.LastName === opms[no].selectedPlayerName)
                        {
                            vobjs[np].selectPlayer = pl
                            ok = true
                            break
                        }
                    }
                }
            }    
        }
    }

    setVertObjects(vobjs);

    synchJumpsAndStats(vobjs, m);

    for (var np=0; np<m.teamA.players.length; np++)
    {
      var pl = m.teamA.players[np]
      pl.isVert = false;
      for (var no=0; no<vobjs.length; no++)
      {
        const vobj = vobjs[no]
        if (vobj.selectPlayer !== undefined && vobj.selectPlayer.Guid === pl.Guid)
        {
          pl.isVert = true
          break
        }
      }
    }
    for (var np=0; np<m.teamB.players.length; np++)
    {
      var pl = m.teamB.players[np]
      pl.isVert = false;
      for (var no=0; no<vobjs.length; no++)
      {
        const vobj = vobjs[no]
        if (vobj.selectPlayer !== undefined && vobj.selectPlayer.Guid === pl.Guid)
        {
          pl.isVert = true
          break
        }
      }
    }
  }, []);

  const selectPlayer = () => {};

  const buttonSelectedPlayer = (vobj) => {
    if (vobj.selectPlayer !== undefined) {
      return vobj.selectPlayer.shirtNumber + ". " + vobj.selectPlayer.LastName;
    } else {
      return "Select Player";
    }
  };

  const classNameSelectedPlayer = (vobj) => {
    if (vobj.selectPlayer !== undefined) {
      return "btn btn-success";
    } else {
      return "btn btn-error";
    }
  };

  if (vertObjects === null) {
    return <></>;
  }

  return (
    <>
      <p className="my-4 text-lg">
        Match players in Vert XML file to players in Stats DVW file
      </p>
      <div className="w-96">
        {vertObjects.map((vobj, id) => (
          <div
            className="mb-1 rounded-sm card bg-base-200 hover:bg-base-300"
            key={id}
          >
            <div className="flex justify-between">
              <p className="pl-2 pt-2 text-lg font-semibold">
                {vobj.playerName}
              </p>
              <label htmlFor="my-modal-6" className={classNameSelectedPlayer(vobj)} onClick={() => setSelectedVertObject(vobj)}>
                {buttonSelectedPlayer(vobj)}
              </label>
              {/* <button className="btn btn-sm btn-secondary" onClick={() => selectPlayer()}>
                    {buttonSelectedPlayer(vobj)}
                </button> */}
            </div>
          </div>
        ))}
      </div>
      <button
        className="my-4 btn btn-md btn-primary"
        onClick={() => doVideoStatsVert()}
      >
        Report
      </button>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-w-5xl h-full">
          {
            selectedVertObject === null ? <></> :
            <p>Select the player in DVW file that matches {selectedVertObject.playerName}</p>
          }
          <div className="flex justify-between mt-2">
            <div className="">
              <h3 className="font-bold text-lg">{match.teamA.Name}</h3>
              <div className="flex-col h-full overflow-y-auto">
                {match.teamA.players.map((player, id) => (
                  <div
                    key={id}
                    className="mb-1 rounded-sm card h-7 bg-base-200 hover:bg-base-300"
                    onClick={() => doSelectPlayer(player)}
                  >
                    {player.shirtNumber}. {player.LastName}
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="font-bold text-lg">{match.teamB.Name}</h3>
              <div className="flex-col h-full overflow-y-auto">
                {match.teamB.players.map((player, id) => (
                  <div
                  key={id}
                  className="mb-1 rounded-sm card h-7 bg-base-200 hover:bg-base-300"
                    onClick={() => doSelectPlayer(player)}
                  >
                    {player.shirtNumber}. {player.LastName}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Done
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default SynchScreen;
