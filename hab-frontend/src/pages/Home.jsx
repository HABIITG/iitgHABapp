import { useState, useEffect } from "react";

import OverallStatsHeader from "./stats/OverallStatsHeader.jsx";
import OverallStatsCards from "./stats/OverallStatsCards.jsx";
import MealStatistic from "./stats/MealStatistic.jsx";
import TopHostelStatistic from "./stats/TopHostelStatistic.jsx";

import { getStatsByDate, getAllHostelMessInfo } from "../apis/stats.js";

//function to get previous date (default displays previous date)
function getprevdate() {
  const today = new Date();
  const mm = today.getMonth() + 1;
  const dd = today.getDate() - 1;
  return [today.getFullYear(),
  (mm > 9 ? '' : '0') + mm,
  (dd > 9 ? '' : '0') + dd
  ].join('-');
}


function Home() {

  const [date, setDate] = useState(getprevdate());
  const [stats, setStats] = useState({});
  const [hostelData, setHostelData] = useState({});

  const fetchStats = async () => {
    let data = await getStatsByDate(date);
    setStats(data);
  };
  const fetchHostels = async () => {
    let data = await getAllHostelMessInfo();
    setHostelData(data);
  }

  useEffect(() => {
    fetchStats();
  }, [date]);

  useEffect(() => {
    fetchHostels();
  }, [])

  return (
    <div className="p-4 min-h-full m-auto">
      <div className="m-auto p-1 min-h-screen max-w-300 bg-inherit">

        <OverallStatsHeader date={date} setDate={setDate} />

        <OverallStatsCards stats={stats} />

        <MealStatistic meal="Breakfast" date={date} stats={stats} />
        <MealStatistic meal="Lunch" date={date} stats={stats} />
        <MealStatistic meal="Dinner" date={date} stats={stats} />

        <TopHostelStatistic stats={stats} data={hostelData}/>

      </div>
    </div>
  )
}

export default Home;