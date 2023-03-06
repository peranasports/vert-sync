import { useState, useEffect } from "react";

function VSSItem({ vssPackage, onPackageSelected }) {
    const [, forceUpdate] = useState(0);

  const doPackageSelect = () => {
    vssPackage.isSelected = !vssPackage.isSelected
    forceUpdate((n) => !n)
    onPackageSelected(vssPackage);
  };

  useEffect(() => {

  }, [])

  return (
    <div>
      <div className="mb-1 rounded-sm card-compact px-2 bg-base-200 hover:bg-base-300" onClick={() => doPackageSelect()}>
        <div className="flex">
          <div className="form-control">
            <label className="label cursor-pointer">
                <input type="checkbox" checked={vssPackage.isSelected} className="checkbox" />
            </label>
          </div>
          <div className="text-left">
            <p className="pl-2 pt-2 text-md font-semibold">
              {vssPackage.matchDescription}
            </p>
            <div className="flex justify-between">
              <p className="pl-2 pb-2 text-sm">{vssPackage.matchScores}</p>
              <p className="pl-2 pb-2 text-sm">{vssPackage.matchDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VSSItem;
