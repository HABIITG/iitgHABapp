import { LineChartOutlined, AreaChartOutlined } from "@ant-design/icons";
import { Divider } from "antd";

import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function MealStatistic({ meal, stats, date }) {

  //Obtaining the timings for the particular meal
  const timings = {
    "breakfast": ["7:00AM - 9:30AM", "8:00AM - 10:15AM"],
    "lunch": ["12:00PM - 2:15PM", "12:15PM - 2:30PM"],
    "dinner": ["7:30PM - 9:45PM", "8:00PM - 10:15PM"],
  }
  const dateform = new Date(date);
  let index = 0;
  if (dateform.getDay() == 0 || dateform.getDay() == 6) index = 1;

  const currmeal = meal.toLowerCase();

  //Obtaining attendance percentage for the currmeal
  const attendance = ((stats[currmeal] / stats.total) * 100).toFixed(1).toString() + "%";

  //Obtaining rank of meal
  let rank = 0;
  for (const key in stats)
    if (stats[key] > stats[currmeal]) ++rank;

  //Colors based on the rank
  const colormap = {
    3: ["#FEF2F2", "#EF4444", "bg-red-50", "bg-red-100", "!text-red-500"],
    2: ["#FFFBEB", "#F59E0B", "bg-yellow-50", "bg-yellow-100", "!text-yellow-500"],
    1: ["#ECFDF5", "#10B981", "bg-green-50", "bg-green-100", "!text-green-500"],
  };

  if (stats.total)
    return (
      <section className={"bg-white mt-8 p-6 rounded-2xl"}>
        <h2 className="text-lg text-gray-700 font-bold mb-3">{meal} Statistics</h2>
        <Divider size="small" />
        <div className="mt-6 grid grid-cols-2">
          <Doughnut
            className="max-w-60 max-h-60 justify-self-center"
            data={{
              labels: ["Ate", "Did not eat"],
              datasets: [{
                label: meal,
                data: [stats[currmeal], stats.total - stats[currmeal]],
                backgroundColor: [
                  colormap[rank][1],
                  colormap[rank][0],
                ],
              }],
            }}
            options={{
              cutout: '65%'
            }}
          />
          <div>
            <h2 className="text-lg text-gray-700 font-medium mb-2">Quick Stats</h2>

            <div className="flex gap-8">

              <div className={`flex flex-1 gap-4 ${colormap[rank][2]} p-4 items-center rounded-2xl mb-4`}>
                <div className={`p-2 ${colormap[rank][3]} rounded-lg`}>
                  <LineChartOutlined className={`${colormap[rank][4]} text-2xl`} />
                </div>
                <div>
                  <div className="text-xl font-bold">#{rank}</div>
                  <div className="text-sm text-gray-600">Attendance Today</div>
                </div>
              </div>

              <div className="flex flex-1 gap-4 bg-blue-50 p-4 items-center rounded-2xl mb-4">
                <div className="{p-2 bg-blue-100 rounded-lg}">
                  <AreaChartOutlined className="!text-blue-500 text-2xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                  <div className="text-xl font-bold">{attendance}</div>
                </div>
              </div>
            </div>

            <div className="font-medium mb-1">Timings</div>
            <div className="text-sm mb-5 text-gray-500">{timings[currmeal][index]}</div>

            <div className="font-medium mb-1">Breakdown</div>
            <div className="text-sm text-gray-500">Students who ate: {stats[currmeal]}</div>
            <div className="text-sm mb-4 text-gray-500">Students who skipped: {stats.total - stats[currmeal]}</div>
          </div>
        </div>
      </section>
    )
}

export default MealStatistic;