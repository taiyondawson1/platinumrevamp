import MyFxBookLogin from "@/components/MyFxBookLogin";

const MyFxBookLoginPage = () => {
  return (
    <div className="flex-1 p-6 max-w-[1400px] mx-auto">
      <section>
        <h2 className="text-2xl font-semibold text-softWhite mb-4">Connect Your Account</h2>
        <MyFxBookLogin />
      </section>
    </div>
  );
};

export default MyFxBookLoginPage;