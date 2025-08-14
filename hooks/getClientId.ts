export function getClientId() {
  let id = localStorage.getItem("bookingClientId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("bookingClientId", id);
  }
  return id;
}
