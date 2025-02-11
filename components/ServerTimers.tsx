"use client";

import { motion } from "motion/react";

import useIntl from "@hooks/use-intl";
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
  const { tfn } = useIntl("ascension_planner");
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
      name: tfn({ id: "europe", defaultMessage: "Europe" }),
      timezone: "GMT+1",
      daily: EURemaining,
      weekly: EUWeekRemaining,
    },
    {
      name: tfn({ id: "north_america", defaultMessage: "North America" }),
      timezone: "GMT-5",
      daily: NARemaining,
      weekly: NAWeekRemaining,
    },
    {
      name: tfn({ id: "asia", defaultMessage: "Asia" }),
      timezone: "GMT+8",
      daily: AsiaRemaining,
      weekly: AsiaWeekRemaining,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {regions.map((region, index) => (
        <motion.div
          key={region.name}
          variants={regionContainerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="bg-card group relative overflow-hidden rounded-xl p-6 shadow-md transition-shadow hover:shadow-lg"
        >
          {/* Background effects */}
          <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

          <div className="relative">
            {/* Region header */}
            <div className="mb-4 text-center">
              <h3 className="text-card-foreground text-xl font-medium">
                {region.name}{" "}
                <span className="text-muted-foreground text-sm">
                  ({region.timezone})
                </span>
              </h3>
            </div>

            {/* Timer sections */}
            <div className="space-y-3">
              <div className="bg-muted/50 group-hover:bg-muted rounded-lg p-3 text-center transition-colors duration-300">
                <p className="text-muted-foreground text-sm">Daily Reset in</p>
                <p
                  className="text-card-foreground mt-1 font-mono text-lg"
                  suppressHydrationWarning
                >
                  {region.daily}
                </p>
              </div>

              <div className="bg-muted/50 group-hover:bg-muted rounded-lg p-3 text-center transition-colors duration-300">
                <p className="text-muted-foreground text-sm">Weekly Reset in</p>
                <p
                  className="text-card-foreground mt-1 font-mono text-lg"
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
