import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <div
      className="relative min-h-[80vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/hero-bg2.png')",
      }}
    >
      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight">
            Discover Your <span className="text-secondary">Perfect</span> Workspace
          </h1>
          <h1 className="mt-2 text-4xl md:text-6xl font-bold font-heading leading-tight">
            Maximize <span className="text-secondary">Productivity</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl font-sans max-w-xl mx-auto">
            Choose to work online with your team or any of the physical locations close to you.
          </p>
          <Link href="/auth/signup">
            <button className="mt-8 px-10 py-3 bg-secondary text-white font-semibold text-lg rounded-full hover:bg-yellow-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;