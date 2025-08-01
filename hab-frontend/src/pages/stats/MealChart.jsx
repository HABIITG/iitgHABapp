import { Doughnut } from "react-chartjs-2";

const MealChart = ({ title, data, percentage }) => {
  return (
    <div className="text-center">
      <h2 className="font-semibold">{title}</h2>
      <Doughnut
        className="max-w-60 max-h-60 justify-self-center"
        data={data}
      />
      <p className="mt-2 text-sm text-gray-700">Eaten: {percentage}</p>
    </div>
  );
};

export default MealChart;