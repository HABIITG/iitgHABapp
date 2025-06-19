import { BarChartOutlined, CalendarOutlined, TeamOutlined } from "@ant-design/icons";

function OverallStatsCards() {
    return (
        <section className="flex gap-8 mt-8">

          <div className="flex flex-1 gap-4 bg-blue-50 p-6 items-center rounded-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TeamOutlined className="!text-blue-500 text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-xl font-bold">77</div>
            </div>
          </div>

          <div className="flex flex-1 gap-4 bg-green-50 p-6 items-center rounded-2xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChartOutlined className="!text-green-500 text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Attendance</div>
              <div className="text-xl font-bold">{"71.2%"}</div>
            </div>
          </div>

          <div className="flex flex-1 gap-4 bg-purple-50 p-6 items-center rounded-2xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarOutlined className="!text-purple-500 text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Most Active Meal</div>
              <div className="text-xl font-bold">Lunch</div>
            </div>
          </div>

        </section>
    )
}

export default OverallStatsCards;