"use client";

import dynamic from "next/dynamic";

const TodoLazy = dynamic(() => import("@components/genshin/Todo"), {
  ssr: false,
});

export default TodoLazy;
