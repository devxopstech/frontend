const Loader = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-700 animate-[bounce_1s_infinite_100ms]"></div>
        <div className="w-3 h-3 rounded-full bg-purple-700 animate-[bounce_1s_infinite_300ms]"></div>
        <div className="w-3 h-3 rounded-full bg-purple-700 animate-[bounce_1s_infinite_500ms]"></div>
      </div>
    </div>
  );
};

export default Loader;
