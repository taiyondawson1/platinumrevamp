import MyFxBookLogin from "@/components/MyFxBookLogin";

const Home = () => {
  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-6">
        <MyFxBookLogin />
      </div>
    </main>
  );
};

export default Home;