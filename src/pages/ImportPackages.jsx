import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VSSList from "../components/panels/VSSList";
import {
    initWithXMLData,
    synchJumpsAndStats,
  } from "../components/utils/VertFile";
  import { initWithData } from "../components/utils/DVWFile";
  
function ImportPackages() {
  const navigate = useNavigate();
  const [vssFiles, setVssFiles] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [vssPackages, setVssPackages] = useState(null);
  const [, forceUpdate] = useState(0);
  const vssRef = useRef();

  const doMultiMatchesReport = () => {

    var vsps = [];
    var teams = {};
    for (var vp of vssPackages) {
      if (vp.isSelected === undefined || vp.isSelected === false) continue;
      vsps.push(vp);
      if (teams[vp.teamA.Name] === undefined)
        teams[vp.teamA.Name] = { team: vp.teamA, count: 0 };
      if (teams[vp.teamB.Name] === undefined)
        teams[vp.teamB.Name] = { team: vp.teamB, count: 0 };
      teams[vp.teamA.Name].count = teams[vp.teamA.Name].count + 1;
      teams[vp.teamB.Name].count = teams[vp.teamB.Name].count + 1;
    }

    if (vsps.length === 0) {
      toast.error("Please select one or more VSS Package.");
      return;
    }

    localStorage.setItem("VssPackages", JSON.stringify(vssPackages));

    setSelectedPackages(vsps)

    var team = null;
    for (var prop in teams) {
      if (teams[prop].count === vsps.length) {
        team = teams[prop].team;
        break;
      }
    }

    const st = {
      team: team,
      vssPackages: vsps,
    };
    navigate("/multimatchesreport", { state: st });
  };

  const doVertReportOnVssPackage = () => {    
    if (selectedPackages.length > 1)
    {
        toast.error("More than one VSS Package is selected.");
        return;  
    }

    if (selectedPackage === null) {
      toast.error("Please select a VSS Package.");
      return;
    }

    localStorage.setItem("VssPackages", JSON.stringify(vssPackages));

    var m = initWithData(selectedPackage.dvFileData);
    var vobjs = initWithXMLData(selectedPackage.vertFileData);
    var opms = selectedPackage.matchingNames;
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
    const st = {
        match: m,
        vertObjects: vobjs,
        onlineVideoFileUrl: selectedPackage.onlineVideoFileUrl,
      };
      navigate("/videostatsvert", { state: st });
  };

  const doStatsReportOnVssPackage = () => {
    if (selectedPackage === null) {
      toast.error("Please select a VSS Package.");
      return;
    }
    const st = {
      dvFileData: selectedPackage.dvFileData,
      vertFileData: selectedPackage.vertFileData,
      onlineVideoFileUrl: selectedPackage.onlineVideoFileUrl,

      vssPackage: selectedPackage,
    };
    navigate("/synchscreen", { state: st });
  };

  const doSelectPackage = (pkg) => {
    var vsps = []
    for (var vp of vssPackages) {
        if (vp.isSelected === undefined || vp.isSelected === false) continue;
        vsps.push(vp);
        setSelectedPackage(vp);
    }
    if (vsps.length > 1)
    {
        setSelectedPackage(null)
    }
    setSelectedPackages(vsps)  
    forceUpdate((n) => !n)
  };

  const handleVssFileSelected = (e) => {
    const files = Array.from(e.target.files);
    setVssFiles(files);
    console.log("files:", files);
    localStorage.setItem("VssFiles", files);
    var vps = [];
    for (var nf = 0; nf < files.length; nf++) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[nf], "UTF-8");
      fileReader.onload = (e) => {
        const vp = JSON.parse(e.target.result);
        vp.isSelected = true
        vps.push(vp);
        if (vps.length === files.length) {
          setVssPackages(vps);
          localStorage.setItem("VssPackages", JSON.stringify(vps));
          forceUpdate((n) => !n);
        }
      };
    }
  };

  const doClearAll = () =>
  {
    setSelectedPackages([])
    setVssPackages([])
    localStorage.setItem("VssPackages", JSON.stringify([]));
    forceUpdate((n) => !n)
  }

  const doSelectAll = (all) =>
  {
    var vsps = vssPackages
    for (var vp of vsps)
    {
        vp.isSelected = all
    }
    if (all)
    {
        setSelectedPackages(vssPackages)
    }
    else
    {
        setSelectedPackages([])
    }
    setVssPackages(vsps)
    forceUpdate((n) => !n)
  }

  useEffect(() => {
    const xvsps = localStorage.getItem("VssPackages");
    if (xvsps !== null)
    {
        const vsp = JSON.parse(xvsps)
        setVssPackages(vsp)
        var vsps = []
        for (var vp of vsp) {
            if (vp.isSelected === undefined || vp.isSelected === false) continue;
            vsps.push(vp);
            setSelectedPackage(vp);
        }
        if (vsps.length > 1)
        {
            setSelectedPackage(null)
        }
        setSelectedPackages(vsps)      
    }
  }, [])

  return (
    <>
      <div className="mx-4 my-10 w-100 h-full">
        <p>SELECT VSS PACKAGES</p>
        <div>
          <div className="flex my-4">
            <input
              type="file"
              id="selectedVssFiles"
              ref={vssRef}
              style={{ display: "none" }}
              onChange={handleVssFileSelected}
              multiple
            />
            <input
              type="button"
              className="btn btn-sm w-60"
              value="Select VSS packages..."
              onClick={() =>
                document.getElementById("selectedVssFiles").click()
              }
            />
            <label className="label ml-4">
              <span className="label-text">
                {vssPackages === null || vssPackages.length === 0 ? "Please select VSS packages" : selectedPackages.length + "/" + vssPackages.length + " packages selected"}
              </span>
            </label>
            <button className="btn btn-sm bg-gray-600 ml-4" onClick={() => doClearAll(true)}>Clear All</button>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
            <button className="btn btn-sm bg-gray-600" onClick={() => doSelectAll(true)}>Select All</button>
            <button className="btn btn-sm bg-gray-600" onClick={() => doSelectAll(false)}>Select None</button>
        </div>
        <div className="h-80 overflow-y-auto">
          <VSSList
            vssPackages={vssPackages}
            onSelectPackage={(pkg) => doSelectPackage(pkg)}
          />
        </div>
        <div className="flex space-x-4 mt-2">
          <button
            className="flex btn btn-md btn-primary w-60 my-4"
            onClick={() => doVertReportOnVssPackage()}
          >
            Vert Report
          </button>
          <button
            className="flex btn btn-md btn-primary w-60 my-4 ml-2"
            onClick={() => doMultiMatchesReport()}
          >
            Stats Report
          </button>
        </div>
      </div>
    </>
  );
}

export default ImportPackages;
