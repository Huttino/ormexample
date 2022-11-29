import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { ClassRoom } from "@prisma/client";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getClassRoom } from "../../api/classRoom/[id]";
import { TextField } from "@mui/material";
import { useState } from "react";
import Router from "next/router";
import moment, { Moment } from "moment";

function ReservationForm({ classRoom }: { classRoom: ClassRoom }) {
  moment.locale("it-IT");
  const [start, setStart] = useState(moment());
  const [startselected, setStartSelected] = useState(false);
  const [end, setEnd] = useState(moment());
  const [timeSelected, setTimeSelected] = useState(false);
  const [lessonName, setLessonName] = useState("");
  return (
    <>
      <h1>{classRoom.name}</h1>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          ampm={false}
          label="From"
          disablePast={true}
          minDateTime={moment(moment.now()).add(1, "hour")}
          minutesStep={15}
          maxDate={moment(moment.now()).add(1, "month")}
          onChange={(value: Moment | null) => {
            setStart(moment.utc(value));
          }}
          value={start}
          onAccept={function (value: Moment | null): void {
            setStartSelected(true);
            setStart(moment.utc(value));
            setEnd(moment.utc(value));
          }}
          renderInput={(props) => <TextField {...props} />}
        />
        <br />
        <br />
        <TimePicker
          ampm={false}
          minutesStep={15}
          disabled={!startselected}
          minTime={moment(end)}
          maxTime={moment(start).add(3, "hours")}
          disableIgnoringDatePartForTimeValidation={true}
          label="Hours"
          value={end}
          onChange={(value: unknown) => {}}
          onAccept={function (value: Moment | null): void {
            setTimeSelected(true);
            setEnd(moment.utc(value));
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
          await sendReservation(
            classRoom.id,
            lessonName,
            start.toDate(),
            end.toDate()
          )
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
