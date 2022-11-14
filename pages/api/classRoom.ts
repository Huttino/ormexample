import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse) {
	switch (req.method) {
		case ("GET"):
			return await getAllClassRooms(res)
		case ("POST"):
			return await saveClassRoom(req, res)
		default:
			res.status(501).json({ message: "Methon not implemented", success: false })
	}
}
export async function getAllClassRooms(res: NextApiResponse) {
	const list = prisma.classRoom.findFirst()
	return res.status(200).json({ list, success: true })
}
export async function saveClassRoom(req: NextApiRequest, res: NextApiResponse) {
	const newClass = req.body
	try {
		const toRet = await prisma.classRoom.create({
			data: {
				name: newClass.name,
				location: newClass.location
			}
		})
		return res.status(301).json({ toRet, success: true })
	} catch (error) {
		return res.status(500).json({ message: "Couldn't create the ClassRoom", succes: false })
	}
}