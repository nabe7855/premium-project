
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cast = await prisma.cast.findFirst();
  if (!cast) {
    console.log('No cast found');
    return;
  }

  console.log(`Testing with cast ${cast.id} (${cast.name})`);
  
  try {
    console.log('Attempting to save sexiness_level = 100...');
    await prisma.cast.update({
      where: { id: cast.id },
      data: { sexiness_level: 100 }
    });
    console.log('✅ Success! (Constraint allows 100)');
  } catch (err) {
    console.log('❌ Failed! (Constraint violates 100)');
    console.log(err.message);
  }

  try {
    console.log('Attempting to save sexiness_level = 5...');
    await prisma.cast.update({
      where: { id: cast.id },
      data: { sexiness_level: 5 }
    });
    console.log('✅ Success! (Constraint allows 5)');
  } catch (err) {
    console.log('❌ Failed! (Constraint violates 5)');
    console.log(err.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
