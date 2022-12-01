import { Reservation } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import utilStyles from "../styles/utils.module.css";

export default function Status(classId: { classId: number }) {
  const [Loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState(
    null as unknown as {
      currentReservation: Reservation;
      nextReservation: Reservation;
    }
  );
  const [timer, setTimer] = useState(500);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reservation/${classId.classId}`, { method: "GET" })
      .then((res) => {
        return res.json();
      })
      .then(
        (ret: {
          currentReservation: Reservation;
          nextReservation: Reservation;
        }) => {
          setReservations(ret);
          if (ret.currentReservation) {
            setTimer(
              DateTime.fromISO(ret.currentReservation.end.toString())
                .toLocal()
                .diffNow()
                .as("milliseconds") + 5000
            );
          } else if (ret.nextReservation) {
            setTimer(
              DateTime.fromISO(ret.nextReservation.start.toString())
                .toLocal()
                .diffNow()
                .as("milliseconds") + 5000
            );
          } else {
            setTimer(86400000);
          }
          setLoading(false);
        }
      );
    setTimeout(() => {
      if (update) setUpdate(false);
      else setUpdate(true);
    }, timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  if (Loading) return <div>Loading</div>;
  else if (reservations.currentReservation != null)
    return (
      <>
        <div className={utilStyles.status + " " + utilStyles.occupied}></div>
        <small>
          <>{reservations.currentReservation.lessonName}</>
          <br /> Ends At{" "}
          <>
            {DateTime.fromISO(
              reservations.currentReservation.end.toString()
            ).toFormat("HH:mm")}
          </>
        </small>
      </>
    );
  else if (reservations.nextReservation != null)
    return (
      <>
        <div className={utilStyles.status + " " + utilStyles.free}></div>
        <small>
          Free until:
          <>
            {DateTime.fromISO(
              reservations.nextReservation.start.toString()
            ).toFormat("HH:mm")}
          </>
        </small>
      </>
    );
  else
    return (
      <>
        <div className={utilStyles.status + " " + utilStyles.free}></div>
        <small>Free</small>
      </>
    );
}
