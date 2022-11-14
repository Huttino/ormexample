import { PrismaClient } from "@prisma/client"
import { NotFoundError } from "@prisma/client/runtime"
import { NextApiRequest, NextApiResponse } from "next/types"


const prisma = new PrismaClient()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query
	switch (req.method) {
		case ("GET"):
			return await getClassRoom(res, +(id as string))
		case ("DELETE"):
			return await deleteClassRoom(res, +(id as string))
		default:
			return res.status(501).json({ error: "Method not implemented", success: false })
	}
}
export async function getClassRoom(res: NextApiResponse, id: number) {
	try {
		const toReturn = await prisma.classRoom.findUniqueOrThrow({ where: { id: id } })
		return res.status(302).json({ toReturn, success: true })
	} catch (error) {
		if (error instanceof NotFoundError)
			return res.status(404).json({ message: "classRoom not found", success: true })
		else
			return res.status(500).json({ message: "Connection error", success: false })
	}
}

export async function deleteClassRoom(res: NextApiResponse, id: number) {
	try {
		await prisma.classRoom.delete({ where: { id: id } })
		return res.status(200).json({ message: "Deleted", success: true })
	} catch (error) {
		if (error instanceof NotFoundError)
			return res.status(404).json({ message: "classRoom not found", success: true })
		else
			return res.status(500).json({ message: "Connection error", success: false })
	}
}