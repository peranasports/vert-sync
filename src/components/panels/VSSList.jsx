import { useEffect, useState } from "react";
import VSSItem from "./VSSItem";

function VSSList({ vssPackages, onSelectPackage }) {
    const [, forceUpdate] = useState(0);

  const onPackageSelected = (pkg) => {
    onSelectPackage(pkg)
  };

  useEffect(() => {
    forceUpdate((n) => !n)
  }, [, vssPackages])

  if (vssPackages === null)
  {
    return <></>
  }

  return (
    <>
      <div>
        {vssPackages.map((vssPackage, idx) => (
          <VSSItem
            key={idx}
            vssPackage={vssPackage}
            onPackageSelected={(pkg) => onPackageSelected(pkg)}
          />
        ))}
      </div>
    </>
  );
}

export default VSSList;
