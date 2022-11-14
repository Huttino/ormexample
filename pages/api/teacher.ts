import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
let prisma = new PrismaClient()
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse) {
	switch (req.method) {
		case "POST":
			return await saveTeacher(req, res)
		default:
			return res.status(501).json({ message: "Method not implemented", success: false })
	}
}
export async function saveTeacher(
	req: NextApiRequest,
	res: NextApiResponse) {
	try {
		const body = req.body
		const saved = await prisma.teacher.create({
			data: {
				user: {
					create: {
						firstName: body.firstName,
						lastName: body.lastName,
						birthDate: body.birthDate,
						email: body.email,
						password: body.password
					}
				}
			}

		})
		return res.status(302).json({ saved, success: true })
	} catch (error) {
		res.status(500).json({ message: "error saving Teacher", success: false })
	}
}