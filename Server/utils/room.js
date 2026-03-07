export function generateRoomId(userA, userB) {
  const sorted = [userA, userB].sort();
  return `peer_${sorted[0]}_${sorted[1]}`;
}