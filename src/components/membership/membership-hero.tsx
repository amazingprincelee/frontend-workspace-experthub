import Link from "next/link";
import Image from "next/image";

const MembershipHero: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-start lg:h-[590px] px-4 lg:px-0">
        {/* Left container */}
        <div className="w-full lg:w-[60%] text-center lg:text-left">
          <h1 className="font-heading font-bold text-4xl lg:text-6xl mt-12 lg:mt-28">
            Flexible <span className="text-primary">Memberships</span> for{" "}
            <br className="hidden lg:block" /> Every Workspace Need.
          </h1>

          <p className="font-sans mt-6 lg:mt-11 w-full lg:w-96 mx-auto lg:mx-0">
            Whether you need a desk for a day or a private office for a year,
            our membership plans are crafted to match your work style and
            budget.
          </p>

          <Link href="/custome-page">
            <button className="mt-6 lg:mt-11 px-8 py-2 lg:px-10 lg:py-2 bg-secondary text-white font-semibold text-lg rounded-sm hover:bg-yellow-600 transition">
              Become a member
            </button>
          </Link>
        </div>

        {/* Right container */}
        <div className="relative w-full lg:w-[40%] mt-12 lg:mt-0 hidden lg:block">
          <div className="absolute right-0">
            <div className="pix-1 w-32 h-36 lg:w-64 lg:h-72 mx-auto lg:mx-0">
              <Image
                src="/images/hero/pix-1.png"
                alt="hero pix 1"
                width={260}
                height={280}
                objectFit="cover"
              />
            </div>

            <div className="pix-2 w-32 h-36 lg:w-64 lg:h-72 mt-4 lg:mt-0 mx-auto lg:mx-0">
              <Image
                src="/images/hero/pix-2.png"
                alt="hero pix 2"
                width={260}
                height={280}
                objectFit="cover"
              />
            </div>
          </div>

          <div className="absolute w-44 h-56 lg:w-72 lg:h-96 right-24 lg:right-48 top-10 lg:top-20 pix-3 mx-auto lg:mx-0">
            <Image
              src="/images/hero/pix-3.png"
              alt="hero pix 3"
              layout="fill"
              objectFit="cover"
              className="border-solid border-4 lg:border-8 border-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipHero;
