import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import EventsList from "../components/panels/EventsList";
import VertStatsReport from "./VertStatsReport";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  saveToPC,
  dateToYYYYMMDD,
  dateToString,
  matchScoresString,
} from "../components/utils/Utils";

function VideoStatsVert() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    match,
    vertObjects,
    videoFileUrl,
    videoFileName,
    onlineVideoFileUrl,
    dvFileData,
    vertFileData,
    player,
  } = location.state;
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [selectedSet, setSelectedSet] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startVideoTime, setStartVideoTime] = useState(null);
  const [videoOffset, setVideoOffset] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef();
  const [allFilters, setAllFilters] = useState(null);
  const [teamAPlayers, setTeamAPlayers] = useState(null);
  const [teamBPlayers, setTeamBPlayers] = useState(null);
  const [selectedTeamAPlayers, setSelectedTeamAPlayers] = useState(null);
  const [selectedTeamBPlayers, setSelectedTeamBPlayers] = useState(null);

  const eventTypes = [
    { value: 0, label: "All Types" },
    { value: 1, label: "Serve" },
    { value: 2, label: "Serve-Receive" },
    { value: 3, label: "Set" },
    { value: 4, label: "Spike" },
    { value: 5, label: "Block" },
    { value: 6, label: "Defence" },
    { value: 1000, label: "Jump Events" },
  ];
  const [selectedEventTypes, setSelectedEventTypes] = useState([eventTypes[7]]);
  const eventResults = [
    { value: 0, label: "All Results" },
    { value: 1, label: "=" },
    { value: 2, label: "-" },
    { value: 3, label: "/" },
    { value: 4, label: "+" },
    { value: 5, label: "#" },
  ];
  const [selectedEventResults, setSelectedEventResults] = useState([
    eventResults[0],
  ]);
  const jumpHeights = [
    { value: 0, label: "All Heights" },
    { value: 1, label: "less than 10 inches" },
    { value: 2, label: "10 - 20 inches" },
    { value: 3, label: "20 - 30 inches" },
    { value: 4, label: "30 - 40 inches" },
    { value: 5, label: "over 40 inches" },
  ];
  const [selectedJumpHeights, setSelectedJumpHeights] = useState([
    jumpHeights[0],
  ]);
  const landingImpacts = [
    { value: 0, label: "All Impacts" },
    { value: 1, label: "Good" },
    { value: 2, label: "Needs More Work" },
    { value: 3, label: "Poor" },
  ];
  const [selectedLandingImpacts, setSelectedLandingImpacts] = useState([
    landingImpacts[0],
  ]);

  const playerReady = () => {
    if (!isReady) {
      setIsReady(true);
      playerRef.current.seekTo(0, "seconds");
    }
  };

  const doSelectEvent = (ev) => {
    setSelectedEvent(ev);
    if (ev.VideoPosition !== 0)
    {
      playerRef.current.seekTo(ev.VideoPosition, "seconds");
    }
    else
    {
      if (startVideoTime !== null && videoOffset !== null) {
        const secondsSinceEpoch = Math.round(ev.TimeStamp.getTime() / 1000);
        const loc = secondsSinceEpoch - startVideoTime + videoOffset;
        playerRef.current.seekTo(loc, "seconds");
      }
    }
  };

  const onReport = (vobj) => {
    const st = {
      match: match,
      vertObject: vobj,
    };
    navigate("/vertstatsreport", { state: st });
  };

  const onSynchVideo = () => {
    if (selectedEvent === null) {
      toast.error("Please select an event to synch with video!");
      return;
    }
    const secondsSinceEpoch = Math.round(
      selectedEvent.TimeStamp.getTime() / 1000
    );
    setStartVideoTime(secondsSinceEpoch);
    const voffset = playerRef.current.getCurrentTime();
    setVideoOffset(voffset);
    localStorage.setItem(videoFileName + "_offset", voffset.toString());
    localStorage.setItem(
      videoFileName + "_startVideoTime",
      secondsSinceEpoch.toString()
    );
  };

  const onExport = () => {
    var opms = [];
    for (var nn = 0; nn < vertObjects.length; nn++) {
      const opm = {
        playerName: vertObjects[nn].playerName,
        selectedPlayerName:
          vertObjects[nn].selectPlayer.FirstName +
          " " +
          vertObjects[nn].selectPlayer.LastName,
      };
      opms.push(opm);
    }
    const dd = {
      matchDescription: match.teamA.Name + " vs " + match.teamB.Name,
      matchDate: dateToString(match.TrainingDate),
      matchScores: matchScoresString(match),
      teamA: match.teamA,
      teamB: match.teamB,
      onlineVideoFileUrl: onlineVideoFileUrl === null ? "" : onlineVideoFileUrl,
      dvFileData: dvFileData,
      vertFileData: vertFileData,
      matchingNames: opms,
    };
    const fileData = JSON.stringify(dd);
    const filename =
      dateToYYYYMMDD(match.TrainingDate) +
      "_" +
      match.teamA.Name +
      "_vs_" +
      match.teamB.Name +
      ".vss";
    saveToPC(fileData, filename);
  };

  const onDoFilters = () => {
    setAllFilters({
      teamAPlayers: selectedTeamAPlayers,
      teamBPlayers: selectedTeamBPlayers,
      eventTypes: selectedEventTypes,
      eventResults: selectedEventResults,
      jumpHeights: selectedJumpHeights,
      landingImpacts: selectedLandingImpacts,
    });
  };

  const doSelectSet = (idx) => {
    setSelectedSet(idx);
  };

  useEffect(() => {
    const vn = videoFileName !== undefined && videoFileName !== null ? videoFileName : onlineVideoFileUrl;
    setVideoName(vn);
    const vu =
      videoFileUrl === null || videoFileUrl === undefined || videoFileUrl === ""
        ? onlineVideoFileUrl
        : videoFileUrl;
    setVideoUrl(vu);

    const soffset = localStorage.getItem(videoFileName + "_offset");
    if (soffset !== null) {
      setVideoOffset(Number.parseFloat(soffset));
    }
    
    const ssvt = localStorage.getItem(videoFileName + "_startVideoTime");
    if (ssvt !== null) {
      setStartVideoTime(Number.parseInt(ssvt));
    }

    const tapls = teamPlayersList(match.teamA);
    setTeamAPlayers(tapls);
    const tbpls = teamPlayersList(match.teamB);
    setTeamBPlayers(tbpls);
    if (player !== undefined) {
      var ok = false;
      for (const tapl of tapls) {
        if (
          tapl.label.toLowerCase().includes(player.FirstName.toLowerCase()) &&
          tapl.label.toLowerCase().includes(player.LastName.toLowerCase())
        ) {
          setSelectedTeamAPlayers([tapl]);
          setSelectedTeamBPlayers([]);
          setAllFilters({
            teamAPlayers: [tapl],
            teamBPlayers: [],
            eventTypes: selectedEventTypes,
            eventResults: selectedEventResults,
            jumpHeights: selectedJumpHeights,
            landingImpacts: selectedLandingImpacts,
          });
          ok = true;
          break;
        }
      }
      if (ok === false) {
        for (const tbpl of tbpls) {
          if (
            tbpl.label.toLowerCase().includes(player.FirstName.toLowerCase()) &&
            tbpl.label.toLowerCase().includes(player.LastName.toLowerCase())
          ) {
            setSelectedTeamBPlayers([tbpl]);
            setSelectedTeamAPlayers([]);
            ok = true;
            setAllFilters({
              teamAPlayers: [],
              teamBPlayers: [tbpl],
              eventTypes: selectedEventTypes,
              eventResults: selectedEventResults,
              jumpHeights: selectedJumpHeights,
              landingImpacts: selectedLandingImpacts,
            });
            break;
          }
        }
      }
    } else {
      setSelectedTeamAPlayers([{ value: 0, label: "All Players" }]);
      setSelectedTeamBPlayers([{ value: 0, label: "All Players" }]);
    }
  }, []);

  function handleSelectEventTypes(data) {
    if (data.length === 0) {
      setSelectedEventTypes(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedEventTypes(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedEventTypes([data[data.length - 1]]);
      return;
    }
    setSelectedEventTypes(data);
  }

  function handleSelectEventResults(data) {
    if (data.length === 0) {
      setSelectedEventResults(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedEventResults(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedEventResults([data[data.length - 1]]);
      return;
    }
    setSelectedEventResults(data);
  }

  function handleSelectJumpHeights(data) {
    if (data.length === 0) {
      setSelectedJumpHeights(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedJumpHeights(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedJumpHeights([data[data.length - 1]]);
      return;
    }
    setSelectedJumpHeights(data);
  }

  function handleSelectLandings(data) {
    if (data.length === 0) {
      setSelectedLandingImpacts(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedLandingImpacts(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedLandingImpacts([data[data.length - 1]]);
      return;
    }
    setSelectedLandingImpacts(data);
  }

  function handleSelectTeamAPlayers(data) {
    if (data.length === 0) {
      setSelectedTeamAPlayers(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedTeamAPlayers(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedTeamAPlayers([data[data.length - 1]]);
      return;
    }
    setSelectedTeamAPlayers(data);
  }

  function handleSelectTeamBPlayers(data) {
    if (data.length === 0) {
      setSelectedTeamBPlayers(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedTeamBPlayers(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedTeamBPlayers([data[data.length - 1]]);
      return;
    }
    setSelectedTeamBPlayers(data);
  }

  const teamPlayersList = (team) => {
    var pls = [{ value: 0, label: "All Players" }];
    for (var np = 0; np < team.players.length; np++) {
      const pl = team.players[np];
      const plname =
        pl.isVert === false
          ? pl.shirtNumber +
            ". " +
            pl.FirstName +
            " " +
            pl.LastName.toUpperCase()
          : pl.shirtNumber +
            ". " +
            pl.FirstName +
            " " +
            pl.LastName.toUpperCase() +
            " (v)";
      pls.push({ value: np + 1, label: plname, guid: pl.Guid });
    }
    return pls;
  };

  if (match === null) {
    return <></>;
  }

  return (
    <>
      <div className="flex">
        <div className="flex-col w-80">
          <div className="btn-group  mr-4">
            {match.sets.map((s, idx) => (
              <button
                className={
                  selectedSet === idx + 1
                    ? "btn btn-sm bg-gray-600 hover:btn-gray-900 btn-active"
                    : "btn btn-sm bg-gray-600 hover:btn-gray-900"
                }
                key={idx}
                onClick={() => doSelectSet(idx + 1)}
              >
                Set {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex h-[40vw] mt-4">
            <div className="flex-col w-[60vh] h-90 overflow-y-auto">
              <EventsList
                match={match}
                filters={allFilters}
                selectedSet={selectedSet}
                doSelectEvent={(ev) => doSelectEvent(ev)}
              />
            </div>
          </div>
        </div>
        <div className="flex-col ml-4">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <label
                htmlFor="modal-filters"
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
              >
                Filters
              </label>
              <button
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
                onClick={() => onExport()}
              >
                Export
              </button>
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-sm bg-gray-600 hover:btn-gray-900">
                  Report
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {vertObjects.map((vobj, idx) => (
                    <li key={idx} onClick={() => onReport(vobj)}>
                      <a>
                        {vobj.selectPlayer.FirstName}{" "}
                        {vobj.selectPlayer.LastName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
                onClick={() => onSynchVideo()}
              >
                Synch Video
              </button>
            </div>
            <div className="mx-2 flex-col">
              <div className="text-sm text-right text-warning font-semibold">
                {match.teamA.Name.toUpperCase()} vs{" "}
                {match.teamB.Name.toUpperCase()}
              </div>
              <div className="text-sm text-right">
                {dateToString(match.TrainingDate)}
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={true}
              width="100%"
              height="100%"
              controls={true}
              onReady={() => playerReady()}
            />
          </div>
        </div>
      </div>

      <input type="checkbox" id="modal-filters" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-7/12 max-w-5xl h-full">
          <h3 className="mb-4 font-bold text-2xl">Filters</h3>
          <div className="form">
            <div className="my-4">
              <div className="flex justify-between mt-4">
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Event Type</p>
                  <Select
                    id="eventTypesSelect"
                    name="eventTypesSelect"
                    onChange={handleSelectEventTypes}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={eventTypes}
                    value={selectedEventTypes}
                    isMulti
                  />
                </div>
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Event Result</p>
                  <Select
                    id="eventResultsSelect"
                    name="eventResultsSelect"
                    onChange={handleSelectEventResults}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={eventResults}
                    value={selectedEventResults}
                    isMulti
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Jump Height</p>
                  <Select
                    id="jumpHeightsSelect"
                    name="jumpHeightsSelect"
                    onChange={handleSelectJumpHeights}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={jumpHeights}
                    value={selectedJumpHeights}
                    isMulti
                  />
                </div>
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Landing Impact</p>
                  <Select
                    id="landingImpactsSelect"
                    name="landingImpactsSelect"
                    onChange={handleSelectLandings}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={landingImpacts}
                    value={selectedLandingImpacts}
                    isMulti
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">{match.teamA.Name} Players</p>
                  <Select
                    id="teamAPlayersSelect"
                    name="teamAPlayersSelect"
                    onChange={handleSelectTeamAPlayers}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={teamAPlayers}
                    value={selectedTeamAPlayers}
                    isMulti
                  />
                </div>
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">{match.teamB.Name} Players</p>
                  <Select
                    id="teamBPlayersSelect"
                    name="teamBPlayersSelect"
                    onChange={handleSelectTeamBPlayers}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={teamBPlayers}
                    value={selectedTeamBPlayers}
                    isMulti
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="modal-filters"
              className="btn"
              onClick={() => onDoFilters()}
            >
              Apply
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoStatsVert;
