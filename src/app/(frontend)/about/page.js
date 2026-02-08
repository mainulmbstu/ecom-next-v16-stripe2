import { wait } from "@/lib/helpers/helperFunction";
import Image from "next/image";

export const metadata = {
  title: "about",
  description: "about page",
};

const About = async () => {
  let mmm = async () => {
    "use server";
    console.log(22222222222);
  };
  await wait(2000);
  return (
    <div>
      <Image
        src="/adds.jpeg"
        width={500}
        height={300}
        alt="Picture of the author"
      />
    </div>
  );
};

export default About;
