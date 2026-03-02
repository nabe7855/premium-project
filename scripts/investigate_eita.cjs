const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const casts = await prisma.cast.findMany({
      where: {
        OR: [{ name: { contains: 'エイタ' } }, { email: { contains: 'eita' } }],
      },
      select: { id: true, name: true, email: true, login_password: true },
    });
    console.log('--- Cast Search Results ---');
    console.log(JSON.stringify(casts, null, 2));

    if (casts.length > 0) {
      for (const cast of casts) {
        if (cast.email) {
          // NOTE: Prisma cannot access supabase auth users directly easily if they are in 'auth' schema.
          // But usually projects have a 'users' or 'profiles' table in 'public'.
          // Check if there's a user table in public.
          try {
            const u = await prisma.$queryRawUnsafe(
              `SELECT email, role FROM public.users WHERE email = '${cast.email}'`,
            );
            console.log(`--- User (public.users) for ${cast.email} ---`);
            console.log(u);
          } catch (e) {
            console.log(`Could not query public.users for ${cast.email}: ${e.message}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error during check:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
