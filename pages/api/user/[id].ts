import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query
	switch (req.method) {
		case ("GET"):
			return await getUser(res, +(id as string))
		case ("DELETE"):
			return await deleteUser(res, +(id as string))
		default:
			return res.status(501).json({ error: "Method not implemented", success: false })
	}
}

export async function getUser(res: NextApiResponse, userId: number) {
	try {
		const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
		return res.status(302).json({ user, success: true })
	}
	catch (error) {
		if (error instanceof NotFoundError)
			return res.status(404).json({ message: "User not Found", success: false })
		else
			return res.status(500).json({ message: "Connection error", success: false })
	}
}

export async function deleteUser(res: NextApiResponse, userId: number) {
	try {
		await prisma.user.delete({ where: { id: userId } })
		return res.status(200).json({ message: "Deleted", succes: true })
	} catch (error) {
		if (error instanceof NotFoundError)
			return res.status(404).json({ message: "User notfound", success: false })
		else
			return res.status(500).json({ message: "Connection error", success: false })
	}
}