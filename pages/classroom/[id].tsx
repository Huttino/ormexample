import { ClassRoom, Reservation } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import { getClassRoom } from "../api/classRoom/[id]";

function ClassRoomPage({
  classRoom,
  reservations,
}: {
  classRoom: ClassRoom;
  reservations: Reservation[];
}) {
  return (
    <>
      <Head>
        <title>{classRoom.name}</title>
      </Head>
      <h1>{classRoom.name}</h1>
      <ul>
        {reservations.map((x) => (
          <li key={x.id}>{x.lessonName}</li>
        ))}
      </ul>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const data = await getClassRoom(+(context.params?.id + "")).then((x) => {
    return { classRoom: x.classRoom, reservations: x.reservations };
  });
  console.log(data);
  return {
    props: {
      classRoom: data.classRoom,
      reservations: JSON.parse(
        JSON.stringify(data.reservations)
      ) as Reservation[],
    },
  };
};

export default ClassRoomPage;
