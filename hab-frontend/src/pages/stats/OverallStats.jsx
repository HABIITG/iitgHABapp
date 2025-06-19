import { 
  BarChartOutlined, 
  CalendarOutlined,
  TeamOutlined, 
} from "@ant-design/icons"
import { Divider, DatePicker } from "antd";

import OverallStatsHeader from "./OverallStatsHeader";
import OverallStatsCards from "./OverallStatsCards";


function OverallStats() {
  return (
    <div className="p-4 min-h-full m-auto">
      <div className="m-auto p-1 min-h-screen max-w-300 bg-inherit">

        <OverallStatsHeader />

        <OverallStatsCards />

      </div>
    </div>
  )
}

export default OverallStats;