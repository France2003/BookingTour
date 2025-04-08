import { Link } from "react-router-dom";

interface DropdownMenuProps {
  items: string[];
  isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isOpen }) => {
  if (!isOpen) return null;

  return (
    <ul className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10">
      {items.map((item, index) => (
        <li key={index}>
          <Link
            to={`/tour/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block px-4 py-2 hover:bg-gray-200"
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
