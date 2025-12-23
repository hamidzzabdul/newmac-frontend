const Categories = () => {
  return (
    <div className="mt-10 p-4">
      <div className="w-[80%] mx-auto flex flex-col gap-3">
        <div className="w-full flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-red-500">
            Our Categories
          </h2>
        </div>

        <div className="grid grid-cols-3"></div>
      </div>
    </div>
  );
};

export default Categories;
