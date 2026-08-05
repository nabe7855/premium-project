import { getCastProfileBySlug } from '../src/lib/getCastProfileBySlug.ts';

async function main() {
  const castIdentifiers = ['イトウ', 'c142b304-e53b-45e0-a5d1-fe51c3977814', '5e4708a8-911b-48ee-b31a-c1bd787eadaa', '762f9a23-6851-4a7e-bc9e-9e97f22ce53b', 'unknown'];

  for (const id of castIdentifiers) {
    const profile = await getCastProfileBySlug(id);
    console.log(`getCastProfileBySlug("${id}") ->`, profile ? profile.name : 'NULL (404!)');
  }
}

main().catch(console.error);
