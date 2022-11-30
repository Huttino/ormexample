import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ClassRoom } from "@prisma/client";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { getClassRoom } from "../../api/classRoom/[id]";
import { TextField } from "@mui/material";
import { useState } from "react";
import Router from "next/router";
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { DateTime } from "luxon";

function ReservationForm({ classRoom }: { classRoom: ClassRoom }) {
  const [start, setStart] = useState(
    DateTime.now().setZone("Europe/Rome").toJSDate()
  );
  const [startselected, setStartSelected] = useState(false);
  const [end, setEnd] = useState(
    DateTime.now().setZone("Europe/Rome").toJSDate()
  );
  const [timeSelected, setTimeSelected] = useState(false);
  const [lessonName, setLessonName] = useState("");
  return (
    <>
      <h1>{classRoom.name}</h1>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DateTimePicker
          ampm={false}
          label="From"
          disablePast={true}
          minutesStep={15}
          minDateTime={DateTime.now().endOf("day")}
          maxDate={DateTime.now().plus({ months: 1 })}
          onChange={(value: DateTime | null) => {
            if (value) setStart(value.setZone("Europe/Rome").toJSDate());
          }}
          value={start}
          onAccept={function (value: DateTime | null): void {
            if (value) {
              setStartSelected(true);
              setStart(value.setZone("Europe/Rome").toJSDate());
              setEnd(value.setZone("Europe/Rome").toJSDate());
            }
          }}
          renderInput={(props) => <TextField {...props} />}
        />
        <br />
        <br />
        <TimePicker
          ampm={false}
          minutesStep={15}
          disabled={!startselected}
          minTime={DateTime.fromJSDate(start)}
          maxTime={DateTime.fromJSDate(start).plus({ hours: 3 })}
          disableIgnoringDatePartForTimeValidation={true}
          label="Hours"
          value={end}
          onChange={(value: DateTime | null) => {
            if (value) setEnd(value.setZone("Europe/Rome").toJSDate());
          }}
          onAccept={function (value: DateTime | null): void {
            if (value) {
              setTimeSelected(true);
              setEnd(value.setZone("Europe/Rome").toJSDate());
            }
          }}
          renderInput={(props) => <TextField {...props} />}
        ></TimePicker>
      </LocalizationProvider>
      <br />
      <br />
      <input
        type="text"
        onChange={(event: any) => {
          setLessonName(event.target.value);
        }}
      ></input>
      <button
        disabled={!(timeSelected && lessonName.length > 0)}
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
  }).then((res) => {
    if (res.status != 204) {
      alert("hour slot occupied");
    } else Router.push(`/classroom/${classRoomId}`);
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
