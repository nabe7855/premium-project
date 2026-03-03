import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile() && (entry.endsWith('.ts') || entry.endsWith('.tsx'))) yield entry;
  }
}

async function main() {
  let count = 0;
  for await (const file of walk(SRC_DIR)) {
    const content = await fs.readFile(file, 'utf8');

    // replacements
    const newContent = content
      .replace(/@\/components\/magazine\//g, '@/components/ikejo/')
      .replace(/@\/components\/career\//g, '@/components/ikeo/')
      .replace(/\/magazine\//g, '/ikejo/')
      .replace(/\/magazine\?/g, '/ikejo?')
      .replace(/\/career\//g, '/ikeo/')
      .replace(/\/career\?/g, '/ikeo?')
      .replace(/href="\/magazine"/g, 'href="/ikejo"')
      .replace(/href='\/magazine'/g, "href='/ikejo'")
      .replace(/href="\/career"/g, 'href="/ikeo"')
      .replace(/href='\/career'/g, "href='/ikeo'")
      .replace(/href=\{\`\/magazine\/\`/g, 'href={`/ikejo/`')
      .replace(/href=\{\`\/magazine\/\?/g, 'href={`/ikejo/?')
      .replace(/href=\{\`\/career\/\`/g, 'href={`/ikeo/`')
      .replace(/href=\{\`\/career\/\?/g, 'href={`/ikeo/?');

    // Also consider push('/magazine') etc.
    const finalContent = newContent
      .replace(/push\('\/magazine'\)/g, "push('/ikejo')")
      .replace(/push\('\/career'\)/g, "push('/ikeo')")
      .replace(/push\("\/magazine"\)/g, 'push("/ikejo")')
      .replace(/push\("\/career"\)/g, 'push("/ikeo")')
      // revalidatePath
      .replace(/revalidatePath\('\/magazine/g, "revalidatePath('/ikejo")
      .replace(/revalidatePath\("\/magazine/g, 'revalidatePath("/ikejo')
      .replace(/revalidatePath\('\/career/g, "revalidatePath('/ikeo")
      .replace(/revalidatePath\("\/career/g, 'revalidatePath("/ikeo');

    if (content !== finalContent) {
      console.log(`Updated ${file}`);
      await fs.writeFile(file, finalContent, 'utf8');
      count++;
    }
  }
  console.log(`Replaced in ${count} files.`);
}

main().catch(console.error);
