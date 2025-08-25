import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui//separator";
import {
  Scissors,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Check,
  Sparkles,
  Crown,
  Linkedin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { WhatsAppIcon } from "@/app/components/icons/Whatsapp";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pricingPlans = [
    {
      id: "basic",
      title: t("landing.pricing.basic.title"),
      price: t("landing.pricing.basic.price"),
      features: [
        t("landing.pricing.basic.features.1"),
        t("landing.pricing.basic.features.2"),
        t("landing.pricing.basic.features.3"),
      ],
      icon: Scissors,
      popular: false,
    },
    {
      id: "premium",
      title: t("landing.pricing.premium.title"),
      price: t("landing.pricing.premium.price"),
      features: [
        t("landing.pricing.premium.features.1"),
        t("landing.pricing.premium.features.2"),
        t("landing.pricing.premium.features.3"),
        // t("landing.pricing.premium.features.4"),
      ],
      icon: Sparkles,
      popular: true,
    },
    {
      id: "vip",
      title: t("landing.pricing.vip.title"),
      price: t("landing.pricing.vip.price"),
      features: [
        t("landing.pricing.vip.features.1"),
        t("landing.pricing.vip.features.2"),
        // t("landing.pricing.vip.features.3"),
        t("landing.pricing.vip.features.4"),
        t("landing.pricing.vip.features.5"),
      ],
      icon: Crown,
      popular: false,
    },
  ];

  const openWhatsApp = (planTitle: string) => {
    const number = "+962770151780";
    const message = encodeURIComponent(
      `Hi, I want to start the ${planTitle} plan.`
    );
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  return (
    <div className={`min-h-screen bg-background`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-32 h-32 rounded-full bg-primary animate-pulse"></div>
          <div
            className="absolute bottom-40 right-32 w-20 h-20 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: "1s" }}></div>
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                  <Scissors className="w-12 h-12 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-extrabold leading-tight">
              {t("landing.hero.title")}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("landing.hero.subtitle")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16`}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => router.push(`/signup`)}>
                <Clock className={`h-5 w-5`} />
                {t("landing.hero.cta.book")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 hover:bg-primary/5 transition-all duration-300"
                onClick={() => router.push(`/login`)}>
                <Star className={`h-5 w-5`} />
                {t("landing.hero.cta.services")}
              </Button>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              variants={fadeInUp}
              className="relative max-w-md mx-auto mt-[-10px]">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Professional Barber Shop"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl mb-4">
              {t("landing.pricing.title")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("landing.pricing.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto `}>
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeInUp}
                  className="relative">
                  <Card
                    className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      plan.popular
                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="px-3 py-1 bg-primary">
                          {t("landing.pricing.premium.popular")}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div
                        className={`mx-auto p-3 rounded-full w-fit ${
                          plan.popular
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl">{plan.title}</CardTitle>
                      <div className="text-4xl font-bold text-primary mt-2">
                        {plan.price}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Separator className="mb-6" />
                      <ul className={`space-y-3 mb-8`}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className={`flex items-center gap-3`}>
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="flex-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => openWhatsApp(plan.title)}>
                        {t("landing.hero.cta.book")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-8 w-8" />
                <h3 className="text-2xl font-bold">TarteebPro</h3>
              </div>
              <p className="text-primary-foreground/80 max-w-md">
                {t("landing.hero.subtitle")}
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">
                {t("footer.contact.title")}
              </h4>
              <div className="space-y-3 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{t("footer.contact.address")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{t("footer.contact.phone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{t("footer.contact.email")}</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.follow.title")}</h4>
              <div className="flex gap-3">
                {/* <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                  <Instagram className="w-4 h-4" />
                </Button> */}
                <a
                  href="https://wa.me/+962770151780"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                    <WhatsAppIcon className="w-4 h-4" />
                  </Button>
                </a>
                <a
                  href="https://www.linkedin.com/in/bassil-al-jarrah-6b1b85204/"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <Separator className="bg-primary-foreground/20 mb-8" />

          <div className="text-center text-primary-foreground/60 text-sm">
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
