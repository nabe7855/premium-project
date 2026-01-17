'use server';

// 現在はモックデータを使用しているため、将来的にDB化されるまでの暫定的なアクション
export async function getZeroProgressReservationsCount() {
  // 本来は Prisma 等で集計する
  // const count = await prisma.reservation.count({
  //   where: {
  //     steps: {
  //       every: { isCompleted: false }
  //     }
  //   }
  // });

  // モックデータ res-003 が 0/5 なので、一旦 1 を返すか、
  // ReservationManagement.tsx と同じデータをここで管理するようにする。

  // 仮のモックデータ（ReservationManagement.tsx の MOCK_RESERVATIONS と同期）
  const mockData = [
    { id: 'res-001', steps: [true, false, false, false, false] }, // 1/5
    { id: 'res-002', steps: [true, true, true, true, true] }, // 5/5
    { id: 'res-003', steps: [false, false, false, false, false] }, // 0/5
    { id: 'res-004', steps: [true, true, false, false, false] }, // 2/5
    { id: 'res-005', steps: [true, true, true, true, true] }, // 5/5
  ];

  const zeroProgressCount = mockData.filter((res) => res.steps.every((s) => s === false)).length;
  return zeroProgressCount;
}
