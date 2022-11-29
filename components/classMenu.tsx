import { ClassRoom, Reservation } from "@prisma/client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import utilStyle from "../styles/utils.module.css";
import ClassTile from "./classTile";

export default function ClassMenu() {
  const [data, setData] = useState([] as { classRoom: ClassRoom }[]);
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
        <ul>
          {data.map((classRoom) => (
            <Link
              className={utilStyle.classLink}
              href={`/classroom/${classRoom.classRoom.id}`}
              key={classRoom.classRoom.id}
            >
              <li className={utilStyle.classElement}>
                <ClassTile data={classRoom} />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
}
