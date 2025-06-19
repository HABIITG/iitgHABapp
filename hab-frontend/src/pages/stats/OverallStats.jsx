import OverallStatsHeader from "./OverallStatsHeader";
import OverallStatsCards from "./OverallStatsCards";
import MealStatistic from "./MealStatistic";


function OverallStats() {

  return (
    <div className="p-4 min-h-full m-auto">
      <div className="m-auto p-1 min-h-screen max-w-300 bg-inherit">

        <OverallStatsHeader />

        <OverallStatsCards stats={{breakfast: 22, lunch: 45, dinner: 33, total: 77}}/>

        <MealStatistic meal="Breakfast" date="2025-06-19" stats={{breakfast: 22, lunch: 45, dinner: 33, total: 77}} />
        <MealStatistic meal="Lunch" date="2025-06-19" stats={{breakfast: 22, lunch: 45, dinner: 33, total: 77}} />
        <MealStatistic meal="Dinner" date="2025-06-19" stats={{breakfast: 22, lunch: 45, dinner: 33, total: 77}} />

      </div>
    </div>
  )
}

export default OverallStats;