import { Teacher } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../util/db.serve";
const prisma = Prisma.getPrisma()
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case ("POST"):
			return await saveRequest(req, res)
		case ("GET"):
			return await getAllRequests(res)
		default:
			return res.status(501).json({ message: "Method not Implemented", success: false })
	}
}
export async function saveRequest(req: NextApiRequest, res: NextApiResponse) {
	try {
		const body = req.body
		await prisma.teacher.findUniqueOrThrow({ where: { id: body.teacherId } })
		await prisma.classRoom.findUniqueOrThrow({ where: { id: body.classRoomId } })
		const newRequest = await prisma.reservationRequest.create({
			data: {
				lessonName: body.lessonName,
				teacher: {
					connect: {
						id: body.teacherId
					}
				},
				classRoom: {
					connect: {
						id: body.classRoomId
					}
				},
				date: body.date,
				hours: body.hours
			}
		})
		return res.status(302).json({ newRequest, success: true })
	} catch (error) {
		if (error instanceof NotFoundError)
			return res.status(404).json({ message: "one or more resources not found", success: false })
		return res.status(500).json({ error: "connection error: " + (error as Error).message, success: false })
	}
}

export async function getAllRequests(res: NextApiResponse) {
	const list = await prisma.reservationRequest.findMany()
	return res.status(200).json({ list, success: true })
}