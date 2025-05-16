import "./Loader.css"; // Import file CSS
const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999]  flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
