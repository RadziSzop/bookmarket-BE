import { PrismaClient } from "@prisma/client";
export const checkReservations = async () => {
  const prisma = new PrismaClient();
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
