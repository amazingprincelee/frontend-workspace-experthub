import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <div
      className="relative min-h-[120vh] bg-cover bg-center flex flex-col justify-end items-center"
      style={{
        backgroundImage: "url('/images/hero-bg2.png')", 
      }}
    >
     
      <div
        className="relative z-10  h-full text-center text-white px-4" >
        <div className="mb-24 ">
          <h1 className="text-4xl md:text-7xl font-bold font-heading">
            Discover Your <span className="text-secondary">Perfect</span> Workspace.
          </h1>
          <h1 className="mt-4 text-4xl md:text-7xl font-bold font-heading">
            Maximize <span className="text-secondary">Productivity</span>
          </h1>
          <p className="mt-4 text-lg  md:text-xl font-sans ">
            Choose to work online with your team or any <br/> of the physical locations close to you.
          </p>
          <Link href="/auth/signup">
            <button className="mt-11 px-14 py-3 bg-secondary text-white font-semibold text-lg rounded-full hover:bg-yellow-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
