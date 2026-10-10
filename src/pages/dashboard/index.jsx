import React, { useState } from "react";
import HomeBredCurbs from "./HomeBredCurbs";

const Home = () => {
  const [filterMap, setFilterMap] = useState("usa");
  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      <div className="grid grid-cols-12 gap-5 mb-5">
        hi
      </div>
    </div>
  );
};

export default Home;
