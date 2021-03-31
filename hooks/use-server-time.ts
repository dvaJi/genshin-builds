import { endEU, endAsia, endNA } from "@utils/server-time";
import { useState, useEffect } from "react";

type ServerTime = {
  EURemaining: string;
  NARemaining: string;
  AsiaRemaining: string;
  NA: Date;
  EU: Date;
  Asia: Date;
};

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;

const calcRemaining = (endDate: Date) => {
  const now = new Date();
  const nowUTC = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const distance = <any>endDate - <any>nowUTC;

  const hours = Math.floor((distance % _day) / _hour);
  const minutes = Math.floor((distance % _hour) / _minute);
  const seconds = Math.floor((distance % _minute) / _second);

  return hours + "H " + minutes + "M " + seconds + "S";
};

const useServerTime = (): ServerTime => {
  const [EURemaining, setEURemaining] = useState(calcRemaining(endEU()));
  const [NARemaining, setNARemaining] = useState(calcRemaining(endNA()));
  const [AsiaRemaining, setAsiaRemaining] = useState(calcRemaining(endAsia()));
  const [EU, setEU] = useState(endEU());
  const [NA, setNA] = useState(endNA());
  const [Asia, setAsia] = useState(endAsia());

  useEffect(() => {
    const interval = setInterval(() => {
      setEU(endEU());
      setNA(endNA());
      setAsia(endAsia());

      setEURemaining(calcRemaining(endEU()));
      setNARemaining(calcRemaining(endNA()));
      setAsiaRemaining(calcRemaining(endAsia()));
    }, 1000);
    return () => clearInterval(interval);
  }, [EURemaining, NARemaining, AsiaRemaining]);

  return {
    EURemaining,
    NARemaining,
    AsiaRemaining,
    NA,
    EU,
    Asia,
  };
};

export default useServerTime;
