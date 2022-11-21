import { Reservation } from "@prisma/client";

function ReservationList(data: { reservations: Reservation[] }) {
  if (data.reservations)
    return (
      <ul>
        {data.reservations.map((x: Reservation) => (
          <li key={x.id}>
            <div>
              <h5>{x.lessonName}</h5>
              <small>
                {"from:" + x.start.toString().split("T")[1].split(".")[0]}
              </small>
              <br />
              <small>
                {"to:" + x.end.toString().split("T")[1].split(".")[0]}
              </small>
            </div>
          </li>
        ))}
      </ul>
    );
  else return <div>Loading...</div>;
}
export default ReservationList;
