import fs from 'fs';
import path from 'path';

async function inspectFileSystemAndRoutes() {
  console.log('=== INSPECTING FILESYSTEM & ROUTES ===\n');

  const appDir = path.join(process.cwd(), 'src', 'app');

  function scanRoutes(dir, routePath = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let routes = [];
    for (const item of items) {
      if (item.isDirectory()) {
        routes = routes.concat(scanRoutes(path.join(dir, item.name), `${routePath}/${item.name}`));
      } else if (item.name === 'page.tsx' || item.name === 'page.jsx' || item.name === 'page.js') {
        routes.push(routePath || '/');
      }
    }
    return routes;
  }

  const allRoutes = scanRoutes(appDir);
  console.log(`Total App Routes: ${allRoutes.length}`);

  const ikeoOrRecruitRoutes = allRoutes.filter(r => 
    r.includes('ikeo') || 
    r.includes('recruit') || 
    r.includes('guide') ||
    r.includes('column')
  );

  console.log('\nRelevant App Routes:', ikeoOrRecruitRoutes);
}

inspectFileSystemAndRoutes();
