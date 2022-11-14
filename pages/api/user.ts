import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { json } from "stream/consumers";

const prisma = new PrismaClient()

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST":
			return await postUser(req, res)
		case "GET":
			return await getUsers(req, res)
		default:
			return res.status(501).json({ message: 'method not implemented', success: false })
	}
}

export async function postUser(req: NextApiRequest, res: NextApiResponse) {
	const body = req.body
	try {
		const newUser = await prisma.user.create({
			data: {
				firstName: body.firstName,
				lastName: body.lastName,
				birthDate: body.birthDate,
				email: body.email,
				password: body.password
			}
		})
		return res.status(204).json({ newUser, success: true })
	}
	catch (error: any) {
		return res.status(500).json({ error: "Connection error", success: false })
	}
}
export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
	try {
		const list = await prisma.user.findMany()
		return res.status(200).json({ list, success: true })
	} catch (error) {
		return res.status(500).json({ error: 'Error fetching Users', success: false })
	}
}
