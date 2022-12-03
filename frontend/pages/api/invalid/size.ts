import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(413).json({
    message: `Uploaded file exceeds the predifined limit.\nMax file size: ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE}`,
  });
}
