import { getSession } from "@auth0/nextjs-auth0";
import { Reservation } from "@prisma/client";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../util/db.serve";


const prisma = Prisma.getPrisma()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { classId } = req.query
	const session = getSession(req, res)
	switch (req.method) {
		case "POST":
			if (session?.user)
				return res.status(201).json(await saveReservation({ userMail: session?.user.email, classRoomId: + (classId + ""), lessonName: req.body.lessonName, start: req.body.start, end: req.body.end }));
			else
				return res.status(401).json({ success: false })
		case "GET":
			return res.status(200).json(await getCurrentReservation(+(classId + "")))
		default:
			return res.status(501).json({ message: "method not implemented", success: false })
	}
}

export async function saveReservation({ classRoomId, lessonName, start, end, userMail }: { classRoomId: number, lessonName: string, start: Date, end: Date, userMail: string }) {
	if (start > end) { throw new Error("invalid time") }

	if (await prisma.reservation.count({
		where: {
			AND: [{
				classRoomId: {
					equals: classRoomId
				},
			}, {
				OR: [{
					AND: [{
						start: {
							gte: start,
							lte: end
						},
						end: {
							lte: end,
							gte: start
						}
					}]
				}, {
					AND: [{
						start: {
							lte: start
						},
						end: {
							lte: end,
							gte: start
						}
					}]

				}, {
					AND: [{
						start: {
							gte: start,
							lte: end,
						},
						end: {
							gte: end
						}
					}]
				}]
			}]
		}

	}) > 0
	) {
		throw new ConcurrentReservationError("Time Slot already occupied")
	}
	else {
		return await prisma.reservation.create({
			data: {
				start: start,
				end: end,
				lessonName: lessonName,
				classRoom: { connect: { id: classRoomId } },
				user: { connect: { email: userMail } }
			},
		}).then((x) => {
			return x
		})
	}
}
export async function getCurrentReservation(classId: number) {
	const dateNow = DateTime.now().setZone("Europe/Rome")
	const currentReservation = await prisma.reservation.findFirst({
		where: {
			classRoomId: classId,

			start: {
				lt: dateNow.toISO()
			},
			end: {
				gt: dateNow.toISO()
			}
		}
	}).then((x: Reservation | null) => {
		if (x) {
			x.end = DateTime.fromJSDate(x.end).toLocal().toJSDate()
			x.start = DateTime.fromJSDate(x.start).toLocal().toJSDate()
		}
		return x
	})
	const nextReservation = await prisma.reservation.findFirst({
		orderBy: {
			start: 'asc'
		},
		where: {
			classRoomId: classId,
			AND: [{
				start: {
					gte: DateTime.now().toISO()
				}
			}, {
				start: {
					lt: dateNow.endOf('day').toISO()
				},
				end: {
					lt: dateNow.endOf('day').toISO()
				}
			}]
		}
	}).then((x: Reservation | null) => {
		if (x) {
			x.end = DateTime.fromJSDate(x.end).setZone("Europe/Rome").toJSDate()
			x.start = DateTime.fromISO(x.start.toISOString()).toLocal().toJSDate()
		}
		return x
	})
	return { currentReservation, nextReservation }
}

export class ConcurrentReservationError extends Error {

}

