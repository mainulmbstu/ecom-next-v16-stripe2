import { Suspense } from "react";
import Skeleton from "@/lib/components/Skeleton";

import Home1 from "@/lib/components/homePage/Home1";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Adds from "@/lib/components/Adds";

const Home = async ({ searchParams }) => {
  // let { data } = await Axios.get(`/api/both/category-list`);
  let data = fetch(`${process.env.BASE_URL}/api/both/category-list`).then(
    (res) => res.json(),
  );
  // console.log(data);
  return (
    <div className=" relative">
      <Adds />
      <Suspense fallback=<Skeleton />>
        <Home1 searchParams={searchParams} promise={data} />
      </Suspense>
    </div>
  );
};

export default Home;
