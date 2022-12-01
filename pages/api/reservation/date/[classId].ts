import { Reservation } from "@prisma/client";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../../util/db.serve";

const prisma = Prisma.getPrisma()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { classId } = req.query
	switch (req.method) {
		case "POST":
			try {
				const date = req.body.date
				const data = await retrieveReservationOf(date, +(classId + ""))
				return res.status(200).json({ reservations: data })
			}
			catch (e: any) {
				return res.status(500).json({ message: "error in retrieving the reservations: " + e.message, success: false })
			}
		default:
			return res.status(501).json({ message: "method not implemented", success: false })
	}
}

export async function retrieveReservationOf(date: Date, classId: number) {
	const today = DateTime.fromISO(date.toString())
	const ret = await prisma.reservation.findMany({
		where: {

			start: {
				lt: today.plus({ days: 1 }).toISO(),
				gt: today.toISO()
			},
			classRoomId: {
				equals: classId
			}

		}
	})
	const response = [] as Reservation[]
	ret.forEach(x => response.push(x))
	return response
}