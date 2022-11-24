import { ClassRoom, PrismaClient } from "@prisma/client"
import { NotFoundError } from "@prisma/client/runtime"
import { NextApiRequest, NextApiResponse } from "next/types"
import { Prisma } from "../../../util/db.serve"


const prisma = Prisma.getPrisma()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query
	switch (req.method) {
		case ("GET"):
			try {
				const result = await getClassRoom(+(id as string))
				return res.status(302).json({ result, success: true })
			}
			catch (error) {
				if (error instanceof NotFoundError)
					return res.status(404).json({ message: 'CLassRoom Not Found', success: true })
				else
					return res.status(500).json({ message: 'connection Error', success: false })
			}
		case ("DELETE"):
			try {
				await deleteClassRoom(res, +(id as string))
			} catch (error) {
				if (error instanceof NotFoundError)
					return res.status(404).json({ message: "classRoom not found", success: true })
				else
					return res.status(500).json({ message: "Connection error", success: false })
			}
		default:
			return res.status(501).json({ error: "Method not implemented", success: false })
	}
}
export async function getClassRoom(id: number) {
	const toRet = await prisma.classRoom.findUniqueOrThrow({
		select: {
			id: true,
			name: true,
			location: true,
			reservations: true
		},
		where: { id: id }
	}).then(
		x => {
			return { classRoom: { id: x.id, name: x.name, location: x.location } as ClassRoom, reservations: x.reservations }
		}
	)
	return toRet
}

export async function deleteClassRoom(res: NextApiResponse, id: number) {
	await prisma.classRoom.delete({ where: { id: id } })
}