"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import useServerTime from "@hooks/use-server-time";

const regionContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

function ServerTimers() {
  const t = useTranslations("Genshin.ascension_planner");
  const {
    NARemaining,
    NAWeekRemaining,
    EURemaining,
    EUWeekRemaining,
    AsiaRemaining,
    AsiaWeekRemaining,
  } = useServerTime();

  const regions = [
    {
      name: t("europe"),
      timezone: "GMT+1",
      daily: EURemaining,
      weekly: EUWeekRemaining,
    },
    {
      name: t("north_america"),
      timezone: "GMT-5",
      daily: NARemaining,
      weekly: NAWeekRemaining,
    },
    {
      name: t("asia"),
      timezone: "GMT+8",
      daily: AsiaRemaining,
      weekly: AsiaWeekRemaining,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
      {regions.map((region, index) => (
        <motion.div
          key={region.name}
          variants={regionContainerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-lg bg-card p-3 shadow-md transition-shadow hover:shadow-lg sm:rounded-xl sm:p-6"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

          <div className="relative">
            {/* Region header */}
            <div className="mb-2 text-center sm:mb-4">
              <h3 className="text-base font-medium text-card-foreground sm:text-xl">
                {region.name}{" "}
                <span className="text-xs text-muted-foreground sm:text-sm">
                  ({region.timezone})
                </span>
              </h3>
            </div>

            {/* Timer sections */}
            <div className="space-y-2 sm:space-y-3">
              <div className="rounded bg-muted/50 p-2 text-center transition-colors duration-300 group-hover:bg-muted sm:p-3">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Daily Reset in
                </p>
                <p
                  className="mt-0.5 font-mono text-base text-card-foreground sm:mt-1 sm:text-lg"
                  suppressHydrationWarning
                >
                  {region.daily}
                </p>
              </div>

              <div className="rounded bg-muted/50 p-2 text-center transition-colors duration-300 group-hover:bg-muted sm:p-3">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Weekly Reset in
                </p>
                <p
                  className="mt-0.5 font-mono text-base text-card-foreground sm:mt-1 sm:text-lg"
                  suppressHydrationWarning
                >
                  {region.weekly}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ServerTimers;
