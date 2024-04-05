import { prisma } from "../shared/prisma";

export const checkReservations = async () => {
  await prisma.books.updateMany({
    where: {
      reservation: {
        reservationEnd: {
          lt: new Date(),
        },
      },
    },
    data: {
      reserved: false,
    },
  });
  await prisma.reservations.deleteMany({
    where: {
      reservationEnd: {
        lt: new Date(),
      },
    },
  });
};
