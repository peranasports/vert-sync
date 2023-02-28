import React from "react";
import { eventString } from "../utils/DVWFile";

function EventItem({ event, isSelected, onEventSelected }) {
  const doEventSelect = () => {
    onEventSelected(event);
  };

  const background = () => {
    if (isSelected === false) {
      return "mb-1 rounded-sm card-compact bg-base-200 hover:bg-base-300";
    } else {
      return "mb-1 rounded-sm card-compact bg-blue-800 hover:bg-blue-900";
    }
  };

  const getEventStringColor = (e) => {
    var s = "pl-2 text-md";
    if (e.EventType === 20 || e.EventType === 250) {
      s += " text-gray-600";
    }
    if (e.EventGrade === 0) {
      s += " text-red-600";
    } else if (e.EventGrade === 3 && e.EventGrade.EventType !== 2) {
      s += " text-green-600";
    } else if (e.EventGrade === 2 && e.EventGrade.EventType === 5) {
      s += " text-green-600";
    } else {
      s += " text-yellow-600";
    }
    return s;
  };

  const getLandingStress = (ev) => {
    if (ev.vertData.landingstress !== undefined) {
      var cn = "badge badge-error gap-2"
      if (ev.vertData.landingstress < 10)
      {
        cn = "badge badge-success gap-2"
      }
      else if (ev.vertData.landingstress < 20)
      {
        cn = "badge badge-warning gap-2"
      }
      return { value: ev.vertData.landingstress, classname:cn };
    } else {
      return { value: "", className: "" };
    }
  };

  return (
    <div className={background()} onClick={() => doEventSelect()}>
      <div className="">
        {event.isHome ? (
          <div className="text-left">
            <p className="pl-2 pt-2 text-md font-semibold">
              {event.Player.shirtNumber}. {event.Player.FirstName}{" "}
              {event.Player.LastName.toUpperCase()}
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="pl-2 pt-2 text-md font-semibold">
              {event.Player.shirtNumber}. {event.Player.FirstName}{" "}
              {event.Player.LastName.toUpperCase()}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <p className={getEventStringColor(event)}>{eventString(event)}</p>
          <p className="pr-2 text-md">
            ({event.Drill.GameNumber}) {event.TeamScore}-{event.OppositionScore}
          </p>
        </div>
        {
          event.vertData === undefined ? (
            <></>
          ) : (
            <div className="flex">
              <div className="badge badge-info gap-2 mr-4">
                {event.vertData.vertinches.toFixed(1)}"
              </div>
              <div className={getLandingStress(event).classname}>
                {getLandingStress(event).value}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default EventItem;
