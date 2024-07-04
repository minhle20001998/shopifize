import React, { useState, useEffect } from "react";

const useRefHeight = (ref: React.RefObject<HTMLElement>) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(ref.current?.clientHeight ?? 0);
  }, [ref]);

  return height;
};

export default useRefHeight;
