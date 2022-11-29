import { ClassRoom, Reservation } from "@prisma/client";
import utilStyle from "../styles/utils.module.css";
import Status from "./status";
export default function ClassTile(data: {
  data: {
    classRoom: ClassRoom;
  };
}) {
  return (
    <div className={utilStyle.innerClassElement}>
      <big>{data.data.classRoom.name}</big>
      <br />
      <Status classId={data.data.classRoom.id} />
    </div>
  );
}
