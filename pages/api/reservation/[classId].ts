import { getSession, UserProfile, useUser, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../util/db.serve";


const prisma = Prisma.getPrisma()
async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { classId } = req.query
	const session = getSession(req, res)
	switch (req.method) {
		case "POST":
			return res.status(204).json(await saveReservation({ userMail: session?.user.email, classRoomId: + (classId + ""), lessonName: req.body.lessonName, start: req.body.start, end: req.body.end }));

		default:
			return res.status(501).json({ message: "method not implemented", success: false })
	}
}

export async function saveReservation({ classRoomId, lessonName, start, end, userMail }: { classRoomId: number, lessonName: string, start: Date, end: Date, userMail: string }) {
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

export default withApiAuthRequired(handler)
