import { ClassRoom, Reservation } from "@prisma/client";
import utilStyle from "../styles/utils.module.css";
export default function ClassTile(data: {
  data: {
    classRoom: ClassRoom;
    reservations: Reservation[];
  };
}) {
  if (data.data.reservations.length >= 1) {
    const endTime = new Date(data.data.reservations.at(0)?.end as Date);
    return (
      <div className={utilStyle.tile + " " + utilStyle.occupied}>
        <big>{data.data.classRoom.name}</big>
        <br />
        <small>{data.data.classRoom.location}</small>
        <br />
        <b>
          Occupied Until:{" "}
          {String(endTime.getHours() - 1).padStart(2, "0") +
            ":" +
            String(endTime.getMinutes()).padStart(2, "0")}
        </b>
      </div>
    );
  } else
    return (
      <div className={utilStyle.tile + " " + utilStyle.free}>
        <big>{data.data.classRoom.name}</big>
        <br />
        <small>{data.data.classRoom.location}</small>
        <br />
        <b>Free</b>
      </div>
    );
}
