import { ClassRoom, Reservation, ReservationRequest } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import utilStyle from "../styles/utils.module.css";
import ClassTile from "./classTile";

export default function ClassMenu() {
  console.log(new Date().getTime());
  const [data, setData] = useState(
    [] as { classRoom: ClassRoom; reservations: ReservationRequest[] }[]
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/api/classRoom")
      .then((res) => {
        let ret = res.json();
        return ret;
      })
      .then(
        (res: {
          result: {
            classRoom: ClassRoom;
            reservations: ReservationRequest[];
          }[];
        }) => {
          setData(res.result);
          setLoading(false);
        }
      );
  }, []);
  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No ClassRooms</div>;
  else
    return (
      <div>
        <ul className={utilStyle.list}>
          {data.map((classRoom) => (
            <Link
              href={`/classroom/${classRoom.classRoom.id}`}
              key={classRoom.classRoom.id}
              className={utilStyle.link}
            >
              <li className={utilStyle.listItem}>
                <ClassTile data={classRoom} />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
}
