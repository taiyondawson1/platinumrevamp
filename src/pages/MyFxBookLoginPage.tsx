
import MyFxBookLogin from "@/components/MyFxBookLogin";

const MyFxBookLoginPage = () => {
  return (
    <div className="flex-1 p-6 max-w-[1400px] mx-auto">
      <section className="relative">
        <h2 className="text-2xl font-semibold text-softWhite mb-4">Connect Your Account</h2>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8860B]/20 via-[#FFD700]/20 to-[#DAA520]/20 animate-pulse rounded-lg pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 backdrop-blur-sm rounded-lg pointer-events-none" />
          <MyFxBookLogin />
        </div>
      </section>
    </div>
  );
};

export default MyFxBookLoginPage;
