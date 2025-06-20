import { BarChartOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";

function OverallStatsHeader() {
    return (
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChartOutlined  className="!text-blue-500 text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meal Statistics</h1>
              <h3 className="text-sm text-gray-500">Track daily meal attendance patterns</h3>
            </div>
          </div>
            <DatePicker
              size="large"
              className="w-56"
            />
        </header>
    )
}

export default OverallStatsHeader;