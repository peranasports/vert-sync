import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initWithJumpObjects } from "../components/utils/VertStatsObject";

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
      var startts = firstev.TimeStamp.getTime() / 1000;
      var endts = lastev.TimeStamp.getTime() / 1000;

      var nn = 1;
      var ajumps = [];
      for (var nv = 0; nv < vpobj.jumps.length; nv++) {
        var viobj = vpobj.jumps[nv];
        const timeStamp = new Date(vpobj.vertStartTime.getTime() + viobj.timesecs * 1000);
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
  }, [vertObject]);

  if (vertObject.statsObjects === undefined)
  {
    return <></>
  }

  return (
    <>
        <div className="my-10 text-4xl font-heavy">Watch this space</div>
      {/* <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              {
                match.sets.map((s, idx) => (
                    <th key={idx}>Set {idx + 1}</th>
                ))
              }
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Spike Jump Average</th>
              {
                vertObject.statsObjects.map((vobj, idx) => (
                    <th>{vobj.spikeCountTotal === 0 ? "" : (vobj.spikeJumpTotal/vobj.spikeCountTotal).toFixed(1)} ({vobj.spikeCountTotal})</th>
                ))
              }
            </tr>
            <tr>
            <th>Spike Kill Jump Average</th>
              {
                vertObject.statsObjects.map((vobj, idx) => (
                    <th>{vobj.spikeCountKillTotal === 0 ? "" : (vobj.spikeJumpKillTotal/vobj.spikeCountKillTotal).toFixed(1)} ({vobj.spikeCountKillTotal})</th>
                ))
              }
            </tr>
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Carroll Group</td>
              <td>China</td>
              <td>8/15/2020</td>
              <td>Red</td>
            </tr>
            <tr>
              <th>4</th>
              <td>Marjy Ferencz</td>
              <td>Office Assistant I</td>
              <td>Rowe-Schoen</td>
              <td>Russia</td>
              <td>3/25/2021</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>5</th>
              <td>Yancy Tear</td>
              <td>Community Outreach Specialist</td>
              <td>Wyman-Ledner</td>
              <td>Brazil</td>
              <td>5/22/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Irma Vasilik</td>
              <td>Editor</td>
              <td>Wiza, Bins and Emard</td>
              <td>Venezuela</td>
              <td>12/8/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>7</th>
              <td>Meghann Durtnal</td>
              <td>Staff Accountant IV</td>
              <td>Schuster-Schimmel</td>
              <td>Philippines</td>
              <td>2/17/2021</td>
              <td>Yellow</td>
            </tr>
            <tr>
              <th>8</th>
              <td>Sammy Seston</td>
              <td>Accountant I</td>
              <td>O'Hara, Welch and Keebler</td>
              <td>Indonesia</td>
              <td>5/23/2020</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>9</th>
              <td>Lesya Tinham</td>
              <td>Safety Technician IV</td>
              <td>Turner-Kuhlman</td>
              <td>Philippines</td>
              <td>2/21/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>10</th>
              <td>Zaneta Tewkesbury</td>
              <td>VP Marketing</td>
              <td>Sauer LLC</td>
              <td>Chad</td>
              <td>6/23/2020</td>
              <td>Green</td>
            </tr>
            <tr>
              <th>11</th>
              <td>Andy Tipple</td>
              <td>Librarian</td>
              <td>Hilpert Group</td>
              <td>Poland</td>
              <td>7/9/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>12</th>
              <td>Sophi Biles</td>
              <td>Recruiting Manager</td>
              <td>Gutmann Inc</td>
              <td>Indonesia</td>
              <td>2/12/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>13</th>
              <td>Florida Garces</td>
              <td>Web Developer IV</td>
              <td>Gaylord, Pacocha and Baumbach</td>
              <td>Poland</td>
              <td>5/31/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>14</th>
              <td>Maribeth Popping</td>
              <td>Analyst Programmer</td>
              <td>Deckow-Pouros</td>
              <td>Portugal</td>
              <td>4/27/2021</td>
              <td>Aquamarine</td>
            </tr>
            <tr>
              <th>15</th>
              <td>Moritz Dryburgh</td>
              <td>Dental Hygienist</td>
              <td>Schiller, Cole and Hackett</td>
              <td>Sri Lanka</td>
              <td>8/8/2020</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>16</th>
              <td>Reid Semiras</td>
              <td>Teacher</td>
              <td>Sporer, Sipes and Rogahn</td>
              <td>Poland</td>
              <td>7/30/2020</td>
              <td>Green</td>
            </tr>
            <tr>
              <th>17</th>
              <td>Alec Lethby</td>
              <td>Teacher</td>
              <td>Reichel, Glover and Hamill</td>
              <td>China</td>
              <td>2/28/2021</td>
              <td>Khaki</td>
            </tr>
            <tr>
              <th>18</th>
              <td>Aland Wilber</td>
              <td>Quality Control Specialist</td>
              <td>Kshlerin, Rogahn and Swaniawski</td>
              <td>Czech Republic</td>
              <td>9/29/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>19</th>
              <td>Teddie Duerden</td>
              <td>Staff Accountant III</td>
              <td>Pouros, Ullrich and Windler</td>
              <td>France</td>
              <td>10/27/2020</td>
              <td>Aquamarine</td>
            </tr>
            <tr>
              <th>20</th>
              <td>Lorelei Blackstone</td>
              <td>Data Coordiator</td>
              <td>Witting, Kutch and Greenfelder</td>
              <td>Kazakhstan</td>
              <td>6/3/2020</td>
              <td>Red</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>company</th>
              <th>location</th>
              <th>Last Login</th>
              <th>Favorite Color</th>
            </tr>
          </tfoot>
        </table>
      </div> */}
    </>
  );
}

export default VertStatsReport;
