// Simplified physics simulation
export const createGraphLayout = (nodes, links, width, height, depth) => {
  let alpha = 1;
  const alphaDecay = 0.02;
  const alphaTarget = 0;

  const simulation = {
    nodes: nodes,
    links: links,
    tick: function() {
      // Improved force-directed layout with cluster awareness
      const k = Math.sqrt((width * height * depth) / nodes.length);
      
      // Group nodes by cluster for cluster-based forces
      const clusterGroups = {};
      nodes.forEach(node => {
        if (!clusterGroups[node.cluster]) {
          clusterGroups[node.cluster] = [];
        }
        clusterGroups[node.cluster].push(node);
      });
      
      // Repulsion between nodes (reduced for smoother movement)
      nodes.forEach((node, i) => {
        if (node.fixed) return;
        nodes.forEach((other, j) => {
          if (i === j || other.fixed) return;
          
          // Increased repulsion between different clusters
          const sameCluster = node.cluster === other.cluster;
          const repulsionMultiplier = sameCluster ? 0.5 : 1.5;
          
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dz = node.z - other.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const force = (k * k) / dist * repulsionMultiplier;
          const fx = (dx / dist) * force * 0.008;
          const fy = (dy / dist) * force * 0.008;
          const fz = (dz / dist) * force * 0.008;
          node.vx = (node.vx || 0) + fx;
          node.vy = (node.vy || 0) + fy;
          node.vz = (node.vz || 0) + fz;
        });
      });
      
      // Cluster cohesion - attract nodes within same cluster
      Object.keys(clusterGroups).forEach(clusterKey => {
        const clusterNodes = clusterGroups[clusterKey];
        if (clusterNodes.length < 2) return;
        
        // Calculate cluster center
        let centerX = 0, centerY = 0, centerZ = 0;
        clusterNodes.forEach(node => {
          centerX += node.x;
          centerY += node.y;
          centerZ += node.z;
        });
        centerX /= clusterNodes.length;
        centerY /= clusterNodes.length;
        centerZ /= clusterNodes.length;
        
        // Attract nodes to cluster center (stronger attraction)
        clusterNodes.forEach(node => {
          if (node.fixed) return;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          const dz = centerZ - node.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const attractionForce = 0.15; // Increased attraction within clusters
          node.vx = (node.vx || 0) + dx * attractionForce * 0.01;
          node.vy = (node.vy || 0) + dy * attractionForce * 0.01;
          node.vz = (node.vz || 0) + dz * attractionForce * 0.01;
        });
      });

      // Attraction along links (increased strength for smoother connections)
      links.forEach(link => {
        const source = link.source;
        const target = link.target;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dz = target.z - source.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const targetDist = link.distance || 100;
        const diff = (dist - targetDist) / dist;
        const force = diff * link.strength * 0.15; // Increased link strength
        
        if (!source.fixed) {
          source.vx = (source.vx || 0) + dx * force;
          source.vy = (source.vy || 0) + dy * force;
          source.vz = (source.vz || 0) + dz * force;
        }
        if (!target.fixed) {
          target.vx = (target.vx || 0) - dx * force;
          target.vy = (target.vy || 0) - dy * force;
          target.vz = (target.vz || 0) - dz * force;
        }
      });

      // Center force - stronger to keep nodes near center
      const centerX = 0;
      const centerY = 0;
      const centerZ = 0;
      
      nodes.forEach(node => {
        if (node.fixed) return;
        // Stronger center force to pull nodes back
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dz = centerZ - node.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 400) {
          // If node is too far, pull it back strongly
          node.vx = (node.vx || 0) + dx * 0.05;
          node.vy = (node.vy || 0) + dy * 0.05;
          node.vz = (node.vz || 0) + dz * 0.05;
        } else {
          node.vx = (node.vx || 0) + dx * 0.01;
          node.vy = (node.vy || 0) + dy * 0.01;
          node.vz = (node.vz || 0) + dz * 0.01;
        }
      });

      // Apply velocity with increased damping and boundary constraints
      nodes.forEach(node => {
        if (node.fixed) return;
        node.vx = (node.vx || 0) * 0.88; // Damping
        node.vy = (node.vy || 0) * 0.88;
        node.vz = (node.vz || 0) * 0.88;
        
        // Limit velocity to prevent nodes from flying away
        const maxVel = 2;
        node.vx = Math.max(-maxVel, Math.min(maxVel, node.vx));
        node.vy = Math.max(-maxVel, Math.min(maxVel, node.vy));
        node.vz = Math.max(-maxVel, Math.min(maxVel, node.vz));
        
        node.x += node.vx || 0;
        node.y += node.vy || 0;
        node.z += node.vz || 0;
        
        // Boundary constraints - keep nodes within reasonable distance
        const maxDist = 180; // Tighter boundary to keep all nodes visible
        const dist = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z);
        if (dist > maxDist) {
          const scale = maxDist / dist;
          node.x *= scale;
          node.y *= scale;
          node.z *= scale;
          node.vx *= -0.5; // Reverse velocity
          node.vy *= -0.5;
          node.vz *= -0.5;
        }
      });

      alpha += (alphaTarget - alpha) * alphaDecay;
    },
    stop: function() {
      // Stop simulation
    }
  };

  return simulation;
};

export const initializeNodes = (projects, skills) => {
  const nodes = [];
  const nodeMap = new Map();

  // Add core node
  const coreNode = {
    id: 'core',
    type: 'core',
    label: 'Jasser AI Core',
    cluster: 'core',
    x: 0,
    y: 0,
    z: 0,
    radius: 30,
    fixed: true,
  };
  nodes.push(coreNode);
  nodeMap.set('core', coreNode);

  // Add project nodes - positioned in a sphere around center
  projects.forEach((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;
    const radius = 100 + Math.random() * 40; // Closer to center
    const node = {
      id: project.id,
      type: 'project',
      label: project.title,
      cluster: project.cluster,
      project: project,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (Math.random() - 0.5) * 100, // Moderate Z spread
      radius: 25, // Large for visibility
      fixed: false,
      vx: 0,
      vy: 0,
      vz: 0,
    };
    nodes.push(node);
    nodeMap.set(project.id, node);
  });

  // Add skill cluster nodes - positioned around center
  Object.keys(skills).forEach((clusterKey, index) => {
    if (clusterKey === 'core') return;
    const skill = skills[clusterKey];
    const angle = (index / (Object.keys(skills).length - 1)) * Math.PI * 2;
    const radius = 80; // Close to center
    const node = {
      id: `cluster-${clusterKey}`,
      type: 'cluster',
      label: skill.name,
      cluster: clusterKey,
      skills: skill,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (Math.random() - 0.5) * 50, // Small Z spread
      radius: 30, // Large for visibility
      fixed: false,
      vx: 0,
      vy: 0,
      vz: 0,
    };
    nodes.push(node);
    nodeMap.set(`cluster-${clusterKey}`, node);
  });

  return { nodes, nodeMap };
};

export const createLinks = (nodes, projects) => {
  const links = [];
  const coreNode = nodes.find(n => n.id === 'core');

  // Link projects to core
  projects.forEach(project => {
    const projectNode = nodes.find(n => n.id === project.id);
    if (projectNode && coreNode) {
      links.push({
        source: coreNode,
        target: projectNode,
        strength: 0.5,
        distance: 150,
      });
    }

    // Link projects to their cluster
    const clusterNode = nodes.find(n => n.id === `cluster-${project.cluster}`);
    if (projectNode && clusterNode) {
      links.push({
        source: projectNode,
        target: clusterNode,
        strength: 0.8,
        distance: 120,
      });
    }
  });

  // Link clusters to core
  nodes.forEach(node => {
    if (node.type === 'cluster' && coreNode) {
      links.push({
        source: coreNode,
        target: node,
        strength: 0.6,
        distance: 180,
      });
    }
  });

  return links;
};

