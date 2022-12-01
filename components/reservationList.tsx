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
                {"from " +
                  x.start.getHours() +
                  ":" +
                  x.start.getMinutes().toString().padStart(2, "0")}
              </small>
              <br />
              <small>
                {"to " +
                  x.end.getHours() +
                  ":" +
                  x.end.getMinutes().toString().padStart(2, "0")}
              </small>
            </div>
          </li>
        ))}
      </ul>
    );
  else return <div>Loading...</div>;
}
export default ReservationList;
