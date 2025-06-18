import { Divider } from "antd";
import NavBar from "./NavBar";

function Stats() {
    return (
        <div className="p-4 min-h-full bg-gray-100 m-auto">
            <div className="m-auto p-1 min-h-screen max-w-300 shadow-md rounded-2xl bg-white">
                <NavBar />
                <Divider size="small" />
            </div>
        </div>
    )
}

export default Stats;