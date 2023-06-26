import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ name: "Method Not Allowed" });
  }
  const tryAgain = [500, 502, 503, 504, 507, 508, 509];

  try {
    const { data } = await axios.get(
      "https://games-test-api-81e9fb0d564a.herokuapp.com/api/data/",
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          "dev-email-address": "dev@appmasters.com",
        },
      }
    );
    return res.status(200).json({ data });
  } catch (err: any) {
    if (err.code === "ECONNABORTED") {
      return res
        .status(408)
        .json({ error: "O servidor demorou para responder, tente mais tarde" });
    }
    const status = err.response.status;
    if (tryAgain.includes(status)) {
      return res.status(status).json({
        error: "O servidor falhou em responder, tente recarregar a página",
      });
    } else {
      return res.status(status).json({
        error:
          "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde",
      });
    }
  }
}
