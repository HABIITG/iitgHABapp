import { DatabaseOutlined, RiseOutlined, FallOutlined, HomeOutlined } from "@ant-design/icons"

function TopHostelStatistic({ stats, data }) {

  function getHostelName(messId) {
    for (const key in data) {
      if (key._id == messId)
        return key.hostelName;
    }
    return ""
  }

  if (stats.total)
    return (
      <>
        <div className="flex items-center gap-3 mt-12">
          <div className="p-3 bg-blue-100 rounded-lg">
            <DatabaseOutlined className="!text-blue-500 text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Hostel Performance</h1>
            <h3 className="text-sm text-gray-500">Track hostels with highest and lowest attendance</h3>
          </div>
        </div>

        <section className="flex items-center gap-10">
          <div className="flex justify-between p-8 mt-6 bg-green-50 items-center flex-1 rounded-2xl">
            <div>
              <div className="flex gap-3">
                <RiseOutlined className="!text-green-600 text-lg" />
                <div className="text-gray-600">Highest Attendance</div>
              </div>
              <div className="text-3xl font-semibold mt-3">{getHostelName(stats.highest[0])}</div>
              <div className="text-green-600">{stats.highest[1].toString() + "%"} attendance</div>
            </div>
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <HomeOutlined className="!text-green-600 text-3xl" />
            </div>
          </div>
          <div className="flex justify-between p-8 mt-6 bg-orange-50 items-center flex-1 rounded-2xl">
            <div>
              <div className="flex gap-3">
                <FallOutlined className="!text-orange-600 text-lg" />
                <div className="text-gray-600">Lowest Attendance</div>
              </div>
              <div className="text-3xl font-semibold mt-3">{getHostelName(stats.lowest[0])}</div>
              <div className="text-orange-600">{stats.lowest[1].toString() + "%"} attendance</div>
            </div>
            <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center">
              <HomeOutlined className="!text-orange-600 text-3xl" />
            </div>
          </div>

        </section>
      </>
    )
}

export default TopHostelStatistic;