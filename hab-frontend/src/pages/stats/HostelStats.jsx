import { DatePicker } from "antd";
import { Select } from "antd";
import { useState, useEffect } from "react";
import { getStatsByDate } from "../../apis/stats.js";
import dayjs from "dayjs";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Option } = Select;

function HostelStats() {
  const [date, setDate] = useState(`${dayjs().format("YYYY-MM-DD")}`);
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    let data = await getStatsByDate(date);
    setStats(data);
  };
  useEffect(() => {
    fetchStats();
  }, [date]);

  const makePieData = (label, eaten) => {
    const notEaten = stats.total - eaten;
    return {
      labels: ["Eaten", "Not Eaten"],
      datasets: [
        {
          label,
          data: [eaten, notEaten],
          backgroundColor: ["#34d399", "#f87171"],
          borderColor: ["#000", "#000"],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className="p-4 min-h-full bg-gray-100 m-auto">
        <div className="m-auto p-1 min-h-screen max-w-300 shadow-md rounded-2xl bg-white">
          <div className="flex justify-between p-5 items-center bg-sky-200/75 rounded-2xl">
            <h1 className="text-[28px] font-bold w-160">Hostel Statistics</h1>
            <Select placeholder="Select an option" style={{ width: 200 }}>
              <Option value="brahmaputra">Brahmaputra</Option>
              <Option value="kameng">Kameng</Option>
              <Option value="barak">Barak</Option>
            </Select>

            <DatePicker
              defaultValue={dayjs()}
              onChange={(date, dateString) => {
                setDate(dateString);
              }}
              placeholder="Pick a date"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <h2 className="font-semibold">Breakfast</h2>
              <Pie data={makePieData("Breakfast", stats.breakfast)} />
            </div>
            <div className="text-center">
              <h2 className="font-semibold">Lunch</h2>
              <Pie data={makePieData("Lunch", stats.lunch)} />
            </div>
            <div className="text-center">
              <h2 className="font-semibold">Dinner</h2>
              <Pie data={makePieData("Dinner", stats.dinner)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HostelStats;
