import { useState } from "react";
import VSSItem from "./VSSItem";

function VSSList({ vssPackages, onSelectPackage }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const onPackageSelected = (pkg) => {
    setSelectedPackage(pkg);
    onSelectPackage(pkg)
  };

  if (vssPackages === null)
  {
    return <></>
  }

  return (
    <>
      <div>
        {vssPackages.map((vssPackage, idx) => (
          <VSSItem
            vssPackage={vssPackage}
            isSelected={selectedPackage === vssPackage}
            onPackageSelected={(pkg) => onPackageSelected(pkg)}
          />
        ))}
      </div>
    </>
  );
}

export default VSSList;
