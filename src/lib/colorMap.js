export const clusterColors = {
  'rag-nlp': '#FF0033',        // Neon Red
  'voice-ai': '#D00025',       // Crimson Red
  'computer-vision': '#FF2E63', // Hot Red
  'time-series': '#C21833',     // Ruby
  'ml-data': '#8B0000',         // Deep Red
  'web-tools': '#FF5E5E',       // Soft Red
  'core': '#FFFFFF',            // White for core
};

export const getClusterColor = (cluster) => {
  return clusterColors[cluster] || '#FFFFFF';
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 1, g: 1, b: 1 };
};

