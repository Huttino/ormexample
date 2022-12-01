import { ClassRoom, Reservation } from "@prisma/client";
import Head from "next/head";
import { getClassRoom } from "../api/classRoom/[id]";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import ReservationList from "../../components/reservationList";
import utilStyle from "../../styles/utils.module.css";
import Link from "next/link";
import { DateTime } from "luxon";

function ClassRoomPage({ classRoom }: { classRoom: ClassRoom }) {
  const [reservationsHook, setReservationHook] = useState([] as Reservation[]);
  useEffect(() => setReservationHook([]), [classRoom.id]);
  return (
    <>
      <Head>
        <title>{classRoom.name}</title>
      </Head>
      <h1>{classRoom.name}</h1>
      <Link href={`/classroom/reservation/${classRoom.id}`}>Prenota</Link>
      <Calendar
        locale="en-EN"
        value={new Date()}
        onChange={async (value: Date) => {
          setReservationHook(await getReservationForDate(value, classRoom.id));
        }}
      ></Calendar>
      <div className={utilStyle.list}>
        <ReservationList reservations={reservationsHook} />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const data = await getClassRoom(+(context.params?.id + "")).then((x) => {
    return { classRoom: x.classRoom, reservations: x.reservations };
  });
  return {
    props: {
      classRoom: data.classRoom,
    },
  };
};

export async function getReservationForDate(value: Date, classId: number) {
  const data = { date: value };
  const ret = await fetch(`/api/reservation/date/${classId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json; charset=utf8" },
  })
    .then((x) => x.json())
    .then((y) => {
      (y.reservations as Reservation[]).forEach((z) => {
        z.end = new Date(
          DateTime.fromISO(z.end.toString()).toLocal().toJSDate()
        );
        z.start = new Date(
          DateTime.fromISO(z.start.toString()).toLocal().toJSDate()
        );
      });
      return y.reservations;
    })
    .catch((e) => console.log(e));
  return ret as Reservation[];
}

export function setDate(date: Date) {}

export default ClassRoomPage;
