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
    const nowDate = DateTime.now().setZone("Europe/Rome").toJSDate();
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
              DateTime.fromJSDate(ret.currentReservation.end)
                .diffNow()
                .get("millisecond")
            );
          } else if (ret.nextReservation) {
            setTimer(
              DateTime.fromJSDate(ret.nextReservation.start)
                .diffNow()
                .get("millisecond")
            );
          } else {
            setTimer(86400000);
          }
          setLoading(false);
        }
      );
    console.log(timer);
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
          <>{reservations.currentReservation.lessonName}</> Ends At{" "}
          <>
            {reservations.currentReservation.end
              .toString()
              .split("T")[1]
              .substring(0, 5)}
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
          {reservations.nextReservation.start
            .toString()
            .split("T")[1]
            .substring(0, 5)}
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
