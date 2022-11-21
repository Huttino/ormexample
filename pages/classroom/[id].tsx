import { ClassRoom, Reservation } from "@prisma/client";
import Head from "next/head";
import { getClassRoom } from "../api/classRoom/[id]";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import ReservationList from "../../components/reservationList";

function ClassRoomPage({ classRoom }: { classRoom: ClassRoom }) {
  const [reservationsHook, setReservationHook] = useState([] as Reservation[]);
  return (
    <>
      <Head>
        <title>{classRoom.name}</title>
      </Head>
      <h1>{classRoom.name}</h1>
      <Calendar
        locale="en-EN"
        value={new Date()}
        onChange={async (value: Date) => {
          setReservationHook(await getReservationForDate(value, classRoom.id));
        }}
      ></Calendar>
      <ReservationList reservations={reservationsHook} />
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
    .then((y) => y.reservations)
    .catch((e) => console.log(e));
  return ret as Reservation[];
}

export function setDate(date: Date) {}

export default ClassRoomPage;
