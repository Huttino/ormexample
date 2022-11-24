import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ClassRoom } from "@prisma/client";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getClassRoom } from "../../api/classRoom/[id]";
import { TextField } from "@mui/material";
import { useState } from "react";
import Router, { useRouter } from "next/router";

function ReservationForm({ classRoom }: { classRoom: ClassRoom }) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [lessonName, setLessonName] = useState("");
  return (
    <>
      <h1>{classRoom.name}</h1>
      <h2>From:</h2>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          onChange={function (
            value: Date | null,
            keyboardInputValue?: string | undefined
          ): void {
            setStart(new Date(value as Date));
            console.log(start);
          }}
          value={start}
          renderInput={(props) => <TextField {...props} />}
        />
        <h2>To:</h2>
        <DateTimePicker
          onChange={function (
            value: Date | null,
            keyboardInputValue?: string | undefined
          ): void {
            setEnd(new Date(value as Date));
            console.log(end);
          }}
          value={end}
          renderInput={(props) => <TextField {...props} />}
        />
      </LocalizationProvider>
      <input
        type="text"
        onChange={(event: any) => {
          setLessonName(event.target.value);
        }}
      ></input>
      <button
        onClick={async () =>
          await sendReservation(classRoom.id, lessonName, start, end)
        }
      >
        Send
      </button>
    </>
  );
}

export async function sendReservation(
  classRoomId: number,
  lessonName: string,
  start: Date,
  end: Date
) {
  const body = { lessonName: lessonName, start: start, end: end };
  await fetch(`/api/reservation/${classRoomId}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json; charset=utf8" },
  })
    .catch(() => {
      alert("error in saving the reservation");
    })
    .then(() => {
      Router.push(`/classroom/${classRoomId}`);
    });
}

export const getServerSideProps = async function (context: any) {
  const data = await getClassRoom(+(context.params?.id + "")).then((x) => {
    return { classRoom: x.classRoom, reservations: x.reservations };
  });
  return {
    props: {
      classRoom: data.classRoom,
    },
  };
};

const ReservationPage = withPageAuthRequired(ReservationForm);

export default ReservationPage;
