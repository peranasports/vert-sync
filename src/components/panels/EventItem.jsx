import React from "react";
import { eventString } from "../utils/DVWFile";

function EventItem({ event, isSelected, onEventSelected }) {
  const doEventSelect = () => {
    onEventSelected(event);
  };

  const background = () => {
    if (isSelected === false) {
      return "mb-2 rounded-xl card-compact bg-gray-700 hover:bg-base-300";
    } else {
      return "mb-2 rounded-xl card-compact bg-blue-800 hover:bg-blue-900";
    }
  };

  const getEventStringColor = (e) => {
    var s = "pl-2 text-md";
    if (e.EventType === 20 || e.EventType === 250) {
      s += " text-gray-600";
    }
    if (e.EventGrade === 0) {
      s += " text-error";
    } else if (e.EventGrade === 3 && e.EventGrade.EventType !== 2) {
      s += " text-success";
    } else if (e.EventGrade === 2 && e.EventGrade.EventType === 5) {
      s += " text-success";
    } else {
      s += " text-warning";
    }
    return s;
  };

  const getLandingImpact = (ev) => {
    if (ev.vertData.landingpeakgs !== undefined) {
      var cn = "badge badge-error gap-2"
      if (ev.vertData.landingpeakgs < 10)
      {
        cn = "badge badge-success gap-2"
      }
      else if (ev.vertData.landingpeakgs < 20)
      {
        cn = "badge badge-warning gap-2"
      }
      return { value: ev.vertData.landingpeakgs, classname:cn };
    } else {
      return { value: "", className: "" };
    }
  };

  return (
    <div className={background()} onClick={() => doEventSelect()}>
      <div className="">
        {event.isHome ? (
          <div className="text-left bg-white text-gray-500">
            <p className="pl-2 text-md font-semibold">
              {event.Player.shirtNumber}. {event.Player.FirstName}{" "}
              {event.Player.LastName.toUpperCase()}
            </p>
          </div>
        ) : (
          <div className="text-right bg-white text-gray-500">
            <p className="pr-2 text-md font-semibold">
              {event.Player.shirtNumber}. {event.Player.FirstName}{" "}
              {event.Player.LastName.toUpperCase()}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <p className={getEventStringColor(event)}>{eventString(event)}</p>
          <p className="pr-2 pb-2 text-md">
            ({event.Drill.GameNumber}) {event.TeamScore}-{event.OppositionScore}
          </p>
        </div>
        {
          event.vertData === undefined ? (
            <></>
          ) : (
            <div className="flex pb-2">
              <div className="badge badge-info gap-2 mx-2">
                {event.vertData.vertinches.toFixed(1)}"
              </div>
              <div className={getLandingImpact(event).classname}>
                {getLandingImpact(event).value}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default EventItem;
