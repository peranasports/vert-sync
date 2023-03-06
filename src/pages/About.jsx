import React from "react";

function About() {
  const footerYear = new Date().getFullYear();
  return (
    <>
      <div className="my-4">
        <h3 className="text-2xl font-heavy">Vert - Stats - Video Sync</h3>
        <p className="my-4">
          Magically synchronises Vert XML file with Data Volley's DVW file and
          video.
        </p>
        <a
          class="btn btn-sm btn-info"
          href="https://peranasports.com/Documents/VERT-STATS-VIDEO%20SYNC%20UserGuide.pdf"
          target="_blank"
          rel="noopener"
          aria-label="Github"
        >
          Users Guide
        </a>
      </div>
    </>
  );
}

export default About;
