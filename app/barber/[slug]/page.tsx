import BarberLivePage from "@/app/barber/BarberLivePage";

export default function Page({ params }: { params: { slug: string } }) {
  return <BarberLivePage slug={params.slug} />;
}
