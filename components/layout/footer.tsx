import Image from "next/image";
import Link from "next/link";
import githubIcon from "@/public/github.svg"; // Ensure this path is correct

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-2">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} dvlpDana</p>
        <Link href="https://github.com/dvlpDana" target="_blank" rel="noopener noreferrer">
          <Image src={githubIcon} alt="GitHub" width={20} height={20} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
