import React from "react";

function VSSItem({ vssPackage, isSelected, onPackageSelected }) {
  const doPackageSelect = () => {
    onPackageSelected(vssPackage);
  };

  const background = () => {
    if (isSelected === false) {
      return "mb-1 rounded-sm card-compact px-2 bg-base-200 hover:bg-base-300";
    } else {
      return "mb-1 rounded-sm card-compact px-2 bg-blue-800 hover:bg-blue-900";
    }
  };

  return (
    <div>
      <div className={background()} onClick={() => doPackageSelect()}>
        <div className="">
          <div className="text-left">
            <p className="pl-2 pt-2 text-md font-semibold">
              {vssPackage.matchDescription}
            </p>
            <div className="flex justify-between">
                <p className="pl-2 pb-2 text-sm">
                {vssPackage.matchScores}
                </p>
                <p className="pl-2 pb-2 text-sm">
                {vssPackage.matchDate}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VSSItem;
