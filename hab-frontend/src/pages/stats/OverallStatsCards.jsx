import { BarChartOutlined, CalendarOutlined, TeamOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

function OverallStatsCards({ stats }) {

  let sum = 0;
  let first = "breakfast";
  for (const key in stats) {
    if (key == "breakfast" || key == "lunch" || key == "dinner") {
      sum += stats[key];
      if (stats[key] > stats[first]) first = key;
    }
  }

  const attendance = ((sum / stats.total / 3) * 100).toFixed(1).toString() + "%";

  if (stats.total)
    return (
      <section className="flex gap-8 mt-8 flex-col md:flex-row">

        <div className="flex flex-1 gap-4 bg-blue-50 p-4 items-center rounded-2xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TeamOutlined className="!text-blue-500 text-2xl" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Students</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
        </div>

        <div className="flex flex-1 gap-4 bg-green-50 p-4 items-center rounded-2xl">
          <div className="p-2 bg-green-100 rounded-lg">
            <BarChartOutlined className="!text-green-500 text-2xl" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Attendance</div>
            <div className="text-xl font-bold">{attendance}</div>
          </div>
        </div>

        <div className="flex flex-1 gap-4 bg-purple-50 p-4 items-center rounded-2xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CalendarOutlined className="!text-purple-500 text-2xl" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Most Active Meal</div>
            <div className="text-xl font-bold">{first.charAt(0).toUpperCase() + first.slice(1)}</div>
          </div>
        </div>

      </section>
    )
  else
    return (
      <div className="flex flex-col items-center justify-center mt-30">
        <ExclamationCircleOutlined className="!text-red-500 text-8xl mb-6"/>
        <div className="font-semibold text-5xl text-gray-600">This Date has no Stats!</div>
      </div>
    )
}

export default OverallStatsCards;