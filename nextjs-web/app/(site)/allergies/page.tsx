export default function AllergiesPage() {
  const ingredients = [
    { name: "Peanuts", img: "/images/ing_peanuts.png" },
    { name: "Eggs", img: "/images/ing_eggs.png" },
    { name: "Milk", img: "/images/ing_milk.png" },
    { name: "Shellfish", img: "/images/ing_shellfish.png" },
    { name: "Tofu", img: "/images/ing_tofu.png" },
    { name: "Wheat", img: "/images/ing_wheat.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* Title */}
      <h1 className="text-xl text-center font-semibold">Tasty!</h1>

      <h2 className="text-3xl mt-6 text-center font-bold text-green-900">
        Tell us about <br /> any allergies
      </h2>

      <p className="text-center text-gray-600 mt-2 text-sm">
        Select any foods you're allergic to or dislike, <br />
        and we'll make sure not to recommend them.
      </p>

      {/* Search bar */}
      <div className="mt-6 flex justify-center">
        <input
          type="text"
          placeholder="Search Ingredients"
          className="w-full max-w-md p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6 mt-8 max-w-md mx-auto">
        {ingredients.map((item) => (
          <div key={item.name} className="text-center">
            <img
              src={item.img}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-xl"
            />
            <p className="mt-2 text-sm">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-green-900 text-white px-6 py-3 rounded-xl shadow hover:opacity-90">
          Start exploring
        </button>
      </div>
    </div>
  );
}
