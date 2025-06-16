import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Hostels", path: "/hostels" },
    { name: "Caterers", path: "/caterers" },
    { name: "Students", path: "/students" },
  ];

  return (
    <div className="h-screen w-60 bg-sky-800 text-white fixed flex flex-col">
      <div className="text-xl font-semibold text-center py-4 border-b border-sky-700">
        IIT Guwahati HAB
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-sky-700" : "hover:bg-sky-700"
              }`
            }
            end
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
