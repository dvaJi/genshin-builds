"use server";

export async function ChatCompletion(prompt: string) {
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.TOGETHERAI_API_KEY,
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      max_tokens: 512,
      prompt: `[INST] ${prompt} [/INST]`,
      request_type: "language-model-inference",
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stream_tokens: false,
      stop: ["[/INST]", "</s>"],
      prompt_format_string: "[INST]  {prompt}\n [/INST]",
      repetitive_penalty: 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  const json = (await res.json()) as ApiResponse;

  console.log(json);

  return json;
}

type Choice = {
  finish_reason: string | null;
  index: number;
  message: {
    content: string;
    role: string;
  };
};

type ApiResponse = {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
};
