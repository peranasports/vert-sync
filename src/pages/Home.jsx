import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const navigate = useNavigate();
  const [dvFileName, setDvFileName] = useState(null);
  const [dvFileData, setDvFileData] = useState(null);
  const [vertFileName, setVertFileName] = useState(null);
  const [vertFileData, setVertFileData] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const [onlineVideoFileUrl, setOnlineVideoFileUrl] = useState(null);
  const dvRef = useRef();
  const vertRef = useRef();
  const vfRef = useRef();

  const handleChange = (e) => setOnlineVideoFileUrl(e.target.value);

  const importPackages = () => {
    navigate("/importpackages");
  };
  const doVertReport = () => {
    if (dvFileName === null) {
      toast.error("Please select a Data Volley (DVW) file.");
      return;
    }
    if (vertFileName === null) {
      toast.error("Please select a Vert data file.");
      return;
    }
    const st = {
      dvFileData: dvFileData,
      vertFileData: vertFileData,
      videoFileUrl: videoFileUrl,
      videoFileName: videoFileName,
      onlineVideoFileUrl: onlineVideoFileUrl,
    };
    navigate("/synchscreen", { state: st });
  };

  const handleDvFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setDvFileName(files[0].name);
    localStorage.setItem("dvFileName", files[0].name);
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      setDvFileData(e.target.result);
      localStorage.setItem("dvFileData", e.target.result);
    };
  };

  const handleVertFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setVertFileName(files[0].name);
    localStorage.setItem("vertFileName", files[0].name);
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      setVertFileData(e.target.result);
      localStorage.setItem("vertFileData", e.target.result);
    };
  };

  const handleVideoSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setVideoFileName(files[0].name);
    localStorage.setItem("videoFileName", files[0].name);
    setVideoFileUrl(URL.createObjectURL(files[0]));
    localStorage.setItem("videoFileUrl", URL.createObjectURL(files[0]));
  };

  return (
    <>
      {/* <div className="">
        <button className="btn btn-md btn-secondary" onClick={importPackages}>
          Import Packages
        </button>
      </div> */}

      <div className="flex">
        <div className="mx-4 my-10 w-100 h-full">
          <p>VERT - DATA VOLLEY - VIDEO SYNCH</p>
          <div>
            <div className="flex my-4">
              <input
                type="file"
                id="selectedDvFile"
                ref={dvRef}
                style={{ display: "none" }}
                onChange={handleDvFileSelected}
              />
              <input
                type="button"
                className="btn btn-sm w-60"
                value="Select Data Volley file..."
                onClick={() =>
                  document.getElementById("selectedDvFile").click()
                }
              />
              <label className="label ml-4">
                <span className="label-text">
                  {dvFileName === null
                    ? "select Data Volley DVW file"
                    : dvFileName}
                </span>
              </label>
            </div>
          </div>
          <div>
            <div className="flex my-4">
              <input
                type="file"
                id="selectedVertFile"
                ref={vertRef}
                style={{ display: "none" }}
                onChange={handleVertFileSelected}
              />
              <input
                type="button"
                className="btn btn-sm w-60"
                value="Select Vert file..."
                onClick={() =>
                  document.getElementById("selectedVertFile").click()
                }
              />
              <label className="label ml-4">
                <span className="label-text">
                  {vertFileName === null
                    ? "select Vert XML file"
                    : vertFileName}
                </span>
              </label>
            </div>
          </div>
          <div>
            <div className="flex">
              <input
                type="file"
                id="selectedVideo"
                ref={vfRef}
                style={{ display: "none" }}
                onChange={handleVideoSelected}
              />
              <input
                type="button"
                className="btn btn-sm w-60"
                value="Select local video file..."
                onClick={() => document.getElementById("selectedVideo").click()}
              />
              <label className="label ml-4">
                <span className="label-text">
                  {videoFileName === null
                    ? "select local video file"
                    : videoFileName}
                </span>
              </label>
            </div>
          </div>
          <div className="my-4">
            <p className="text-sm">Or Enter Video URL Online</p>
            <input
              type="text"
              className="w-full text-gray-500 bg-gray-200 input input-sm rounded-sm"
              id="onlineVideoUrl"
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-4 mt-2">
            <button
              className="flex btn btn-md btn-primary w-60 my-4"
              onClick={() => doVertReport()}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
