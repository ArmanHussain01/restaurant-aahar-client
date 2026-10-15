import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurants } from "../../state/restaurant/Action";
import RestaurantCart from "../restaurant/RestaurantCart";

const MultiItemCarousel = lazy(() => import("../home/MultiItemCarousel"));
const MemoRestaurantCart = memo(RestaurantCart);

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-6 lg:mb-8">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2B2825]">{title}</h2>
    {subtitle && <p className="mt-1 text-sm sm:text-base text-[#5C5650]">{subtitle}</p>}
  </div>
);

const CarouselSkeleton = () => (
  <div className="flex gap-4 overflow-hidden" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-28 w-28 sm:h-40 sm:w-40 shrink-0 animate-pulse rounded-full bg-black/10" />
    ))}
  </div>
);

const CardSkeleton = () => <div className="h-64 w-full animate-pulse rounded-2xl bg-black/10" />;

const Home = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((store) => store.restaurant?.restaurants);
  const loading = useSelector((store) => store.restaurant?.loading);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !restaurants?.length) dispatch(getAllRestaurants(jwt));
    setRequested(true);
    // Fetch once on mount; cached restaurants are reused.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // `requested` stops the empty message flashing before the first fetch starts.
  const isEmpty = requested && !loading && !restaurants?.length;

  return (
    <div className="pb-12 lg:pb-16 overflow-x-hidden">
      <section className="banner relative isolate flex min-h-[50vh] sm:min-h-[60vh] items-center justify-center px-5 text-center">
        <div className="cover absolute inset-0 -z-10" />
        <div className="fadout" />
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Mana Food
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-gray-200 lg:text-2xl">
            Taste the convenience: food, fast and delivered.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-5 py-10 lg:py-12 lg:px-20">
        <SectionHeading title="Top Meals" subtitle="What everyone is ordering right now" />
        <Suspense fallback={<CarouselSkeleton />}>
          <MultiItemCarousel />
        </Suspense>
      </section>

      <section className="px-4 sm:px-5 lg:px-20 [content-visibility:auto] [contain-intrinsic-size:auto_600px]">
        <SectionHeading
          title="Order from our handpicked favorites"
          subtitle="Restaurants chosen for quality and speed"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : restaurants?.map((item) => <MemoRestaurantCart key={item.id} item={item} />)}
        </div>
        {isEmpty && (
          <p className="py-16 text-center text-[#5C5650]">No restaurants available yet. Check back soon.</p>
        )}
      </section>
    </div>
  );
};

export default Home;