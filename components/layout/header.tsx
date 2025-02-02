import Image from "next/image";
import wheelIcon from "@/public/lucky-draw.svg"; // Ensure this path is correct

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <Image src={wheelIcon} alt="Lucky Draw Logo" width={40} height={40} />
            <h1 className="text-xl font-bold text-gray-900">럭키 드로우</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
