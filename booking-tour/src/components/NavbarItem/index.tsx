
type TNavbarItem = {
  label: string;
  type?: string;
};

const NavbarItem = ({ label, type = "" }: TNavbarItem) => {
  return (
    <button className="nav-link  cursor-pointer">
        <div className={`text-xm ${type}`}></div>
        <div className={`nav-link-tittle ${type}`}>{label}</div>
    </button>
  );
};

export default NavbarItem;