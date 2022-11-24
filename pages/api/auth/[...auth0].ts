import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../util/db.serve";

const prisma = Prisma.getPrisma()

export default handleAuth({
	async callback(req, res) {
		try {
			await handleCallback(req, res, { afterCallback })
		}
		catch (error: any) {
			res.status(500).end(error.message)
		}
	}
})

function afterCallback(req: NextApiRequest, res: NextApiResponse, session: Session): Session {
	prisma.user.findFirst(
		{
			where: {
				email: {
					equals: session.user.email
				}
			}
		}
	)
		.then((x) => {
			if (x) session.user.id = x.id

			else prisma.user.create({
				data: {
					email: (session.user.email as string).toLowerCase()
				}
			}).then((y) => session.user.id = y.id).catch((error) => { throw new Error(error.message) })
		}).catch((error) => { throw new Error(error.message) })
	return session
}