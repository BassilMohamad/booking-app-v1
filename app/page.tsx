import { Scissors } from "@/components/icons/index";
import { Button } from "@/components/ui/button";

import Link from "next/link";

const Home = () => {
  return (
    <div className=" flex justify-center items-center p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 rounded-xl shadow-lg w-full min-h-screen-auto md:h-auto">
        <div className="hidden md:block">
          <Scissors className="w-80 h-40 sm:w-120 sm:h-60 lg:w-160 lg:h-80" />
        </div>

        <div className="flex flex-1 flex-col gap-6 text-center justify-center">
          <h2 className="text-3xl font-bold">الخطوة الأولى</h2>
          <p className="text-lg text-gray-700">
            🟡 <span className="font-bold">أنشئ موقعك الإلكتروني</span> لمشاركته
            مع زبائنك! أضف خدماتك وأسعارك وأوقات الحجز بسهولة عبر لوحة تحكم
            بسيطة، وابدأ استقبال الحجوزات مباشرة.
          </p>
          <div className="flex gap-2 items-center justify-center">
            <Link href="/signup">
              <Button size={"lg"} className="cursor-pointer">
                سجل الان
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant={"secondary"}
                size={"lg"}
                className="cursor-pointer">
                سجل دخول
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
