const HostelInfo = ({ selectedHostel }) => {
  if (!selectedHostel) return null;
  return (
    <div className="flex font-semibold text-[20px] bg-sky-200/25 shadow-md p-5 rounded-2xl mb-[15px] mt-[30px]">
      <h2 className="w-1/2">Hostel: {selectedHostel.hostel_name}</h2>
      {selectedHostel.messId && (
        <h2 className="w-1/2">Mess: {selectedHostel.messId.name}</h2>
      )}
    </div>
  );
};

export default HostelInfo;