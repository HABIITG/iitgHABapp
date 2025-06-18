import { Select, DatePicker } from "antd";

function NavBar() {
  return (
    <div className="flex py-4 px-8 justify-between items-center">
      <h1 className="text-4xl font-semibold">Lohit Hostel</h1>
      <div className="flex gap-8">
        <Select
          showSearch
          placeholder="Select a Hostel"  
        />
        <DatePicker />
      </div>
    </div>
  );
}

export default NavBar;