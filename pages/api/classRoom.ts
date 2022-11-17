import { ClassRoom, Reservation } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../util/db.serve";

const prisma = Prisma.getPrisma()

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse) {
	switch (req.method) {
		case ("GET"):
			try {
				const result = await getAllClassRooms()
				return res.status(200).json({ result, success: true })
			} catch (error: any) {
				return res.status(500).json({ message: "Connection Error", success: false })
			}

		case ("POST"):
			try {
				const result = await saveClassRoom
					(
						req.body.name,
						req.body.location
					)
				return res.status(301).json({ saved: result, success: true })
			} catch (error) {
				return res.status(500).json({ message: "Connection error", succes: false })
			}
		default:
			res.status(501).json({ message: "Methon not implemented", success: false })
	}
}
export async function getAllClassRooms() {
	const nowDate = new Date()
	nowDate.setHours(nowDate.getHours() + 1)
	const classList = await prisma.classRoom.findMany({
		include: {
			reservations: {
				where: {
					AND: [
						{
							start: {
								lt: nowDate.toISOString()
							},
						}, {
							end: {
								gt: nowDate.toISOString()
							}
						}
					]
				}
			}
		}
	}).then(x => {
		return x.map(y => {
			const element: ClassRoom = { id: y.id, name: y.name, location: y.location }
			return { classRoom: element, reservations: y.reservations }
		})
	})
	return classList
}

export async function saveClassRoom(className: string, location: string) {
	const toRet = await prisma.classRoom.create({
		data: {
			name: className,
			location: location
		}
	})
	return toRet
}