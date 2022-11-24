import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = getSession(req, res)
	return res.status(200).json({ userId: session?.user.id })
}