export interface SchoolDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  iconName?: string;
}

export interface SubjectItem {
  id: string;
  schoolId: string;
  name: string;
  code?: string;
  year: number; // 1, 2, 3, 4, 5
  semesters: number[]; // e.g. [1], [1, 2], [3], etc.
  isFoundation?: boolean;
}

export const SCHOOLS: SchoolDefinition[] = [
  {
    id: 'foundation',
    name: 'Foundation & Core Sciences',
    code: 'FND',
    description: 'Years 1 & 2 common curriculum across biological, chemical, mathematical, and physical sciences.',
  },
  {
    id: 'biology',
    name: 'School of Biology',
    code: 'BIO',
    description: 'Biological Sciences, Genetics, Neurobiology, Systems Biology, and Molecular Life Sciences.',
  },
  {
    id: 'chemistry',
    name: 'School of Chemistry',
    code: 'CHM',
    description: 'Chemical Sciences, Organic synthesis, Physical Chemistry, Materials, and Catalysis.',
  },
  {
    id: 'data-science',
    name: 'School of Data Science',
    code: 'DSC',
    description: 'Data Sciences, Machine Learning, Statistical Computing, AI, Algorithms, and Big Data.',
  },
  {
    id: 'earth-sciences',
    name: 'School of Earth & Environmental Sciences',
    code: 'EES',
    description: 'Earth, Climate, Hydrology, Oceanography, GIS & Remote Sensing, and Sustainability.',
  },
  {
    id: 'mathematics',
    name: 'School of Mathematics',
    code: 'MTH',
    description: 'Mathematical Sciences, Analysis, Algebra, Topology, PDEs, Probability, and Optimization.',
  },
  {
    id: 'physics',
    name: 'School of Physics',
    code: 'PHY',
    description: 'Physical Sciences, Quantum Mechanics, Condensed Matter, Classical Mechanics, and Optics.',
  },
  {
    id: 'interdisciplinary',
    name: 'General & Interdisciplinary',
    code: 'IDC',
    description: 'Scientific Writing, Ethics, Economics, Management, Languages, and Philosophy.',
  },
];

export const RAW_FOUNDATION_SUBJECTS = [
  { name: 'Principles of Life I', code: 'BIO111', year: 1, semesters: [1] },
  { name: 'Principles of Life II', code: 'BIO121', year: 1, semesters: [2] },
  { name: 'Principles of Life III: Organismal Biology', code: 'BIO211', year: 2, semesters: [3] },
  { name: 'Principles of Life IV: Microbiology', code: 'BIO221', year: 2, semesters: [4] },
  { name: 'Biology Lab I', code: 'BIO112', year: 1, semesters: [1] },
  { name: 'Biology Lab II', code: 'BIO122', year: 1, semesters: [2] },
  { name: 'Basic Organic & Inorganic Chemistry I', code: 'CHM111', year: 1, semesters: [1] },
  { name: 'Basic Physical Chemistry I', code: 'CHM121', year: 1, semesters: [2] },
  { name: 'Atomic Structure and Chemical Bonding', code: 'CHM211', year: 2, semesters: [3] },
  { name: 'Basic Organic and Inorganic Chemistry II', code: 'CHM221', year: 2, semesters: [4] },
  { name: 'Chemistry Lab I', code: 'CHM112', year: 1, semesters: [1] },
  { name: 'Chemistry Lab II', code: 'CHM122', year: 1, semesters: [2] },
  { name: 'Introduction to Proofs', code: 'MTH100', year: 1, semesters: [1] },
  { name: 'Matrices and Calculus I', code: 'MTH111', year: 1, semesters: [1] },
  { name: 'Calculus and Matrices II', code: 'MTH121', year: 1, semesters: [2] },
  { name: 'Introduction to Probability', code: 'MTH211', year: 2, semesters: [3] },
  { name: 'Mechanics I', code: 'PHY111', year: 1, semesters: [1] },
  { name: 'Electromagnetism', code: 'PHY121', year: 1, semesters: [2] },
  { name: 'Thermal & Statistical Physics', code: 'PHY211', year: 2, semesters: [3] },
  { name: 'Optics', code: 'PHY221', year: 2, semesters: [4] },
  { name: 'Physics Lab I', code: 'PHY112', year: 1, semesters: [1] },
  { name: 'Physics Lab II', code: 'PHY122', year: 1, semesters: [2] },
  { name: 'Introduction to Programming in C/C++', code: 'IDC111', year: 1, semesters: [1] },
  { name: 'Numeric Computing using C/C++', code: 'IDC121', year: 1, semesters: [2] },
  { name: 'Programming in Python', code: 'DSC101', year: 1, semesters: [1, 2] },
  { name: 'Scientific Computing and Data Visualization', code: 'DSC201', year: 2, semesters: [3] },
  { name: 'Mathematical Tools I', code: 'MTH110', year: 1, semesters: [1] },
  { name: 'Mathematical Tools II', code: 'MTH120', year: 1, semesters: [2] },
  { name: 'Introduction to Artificial Intelligence I', code: 'DSC211', year: 2, semesters: [3] },
  { name: 'Mathematical Foundations for Data Science', code: 'DSC221', year: 2, semesters: [4] },
  { name: 'Introduction to Earth and Climate Sciences', code: 'EES111', year: 1, semesters: [1] },
  { name: 'Introduction to Environmental and Sustainability Sciences', code: 'EES121', year: 1, semesters: [2] },
  { name: 'Communication Skills I', code: 'HUM111', year: 1, semesters: [1] },
  { name: 'Communication Skills II', code: 'HUM121', year: 1, semesters: [2] },
  { name: 'Introduction to Economics', code: 'HUM211', year: 2, semesters: [3] },
  { name: 'Introduction to Sociology', code: 'HUM221', year: 2, semesters: [4] },
];

export const RAW_BIOLOGY_SUBJECTS = [
  'Advanced Genetics and Genome Biology',
  'Physiology',
  'Biochemistry',
  'Molecular Biology',
  'Structural Biology',
  'Immunology',
  'Cell Biology',
  'Ecology and Evolution',
  'Biostatistics',
  'Bioinformatics',
  'Bio-imaging and Processing',
  'Drug Discovery and Development',
  'Developmental Biology',
  'Neurobiology',
  'Synthetic Biology',
  'Stem Cells and Regenerative Medicine',
  'Advanced Developmental Biology',
  'Animal Behaviour',
  'Cancer Biology',
  'Genome Stability',
  'Bacterial Genetics',
  'Systems Biology',
  'Advanced Biology Lab I',
  'Advanced Biology Lab II',
  'Advanced Biology Lab III',
  'Biomolecular Spectroscopy and Mass Spectrometry',
  'Cryo-Electron Microscopy and 3D Image Processing for Life Sciences',
  'Pharmacology and Pharmacokinetics',
  'Biophysical Chemistry',
  'Biomaterials-related courses'
];

export const RAW_CHEMISTRY_SUBJECTS = [
  'Chemistry of Biomolecules and Heterocycles',
  'Physical Chemistry II',
  'Coordination Chemistry',
  'Organic Chemistry—Reactions and Mechanisms',
  'Organic Chemistry—Synthetic Methods',
  'Inorganic Chemistry',
  'Bioinorganic Chemistry',
  'Organometallic Chemistry',
  'Advanced Organic Chemistry',
  'Advanced Physical Chemistry',
  'Advanced Inorganic Chemistry',
  'Materials Chemistry',
  'Solid State Chemistry',
  'Nanochemistry',
  'Advanced Chemistry Lab I',
  'Advanced Chemistry Lab II',
  'Advanced Chemistry Lab III',
  'Medicinal Chemistry',
  'Biophysical Chemistry',
  'Enzymology and Biocatalysis',
  'Biomaterials',
  'Pharmacology and Pharmacokinetics',
  'Soft Matter and Polymers',
  'Name Reactions and Rearrangements—Application in Organic Synthesis',
  'Transfer Hydrogenation',
  'Reductive Coupling',
  'Supramolecular Chemistry',
  'Advanced Main Group Chemistry',
  'Fundamentals of Solution-State NMR Spectroscopy',
  'Nanotechnology—Basic Principles and Applications',
  'Molecular Dynamics Simulations',
  'Photocatalysis in Organic Synthesis',
  'Advanced Optical Spectroscopy',
  'Ultrafast Spectroscopy',
  'Applied Organometallic Chemistry',
  'Batteries, Fuel Cells and Electrolyzers',
  'Inorganic Rings, Chains and Polymers'
];

export const RAW_DATA_SCIENCE_SUBJECTS = [
  'Mathematical Statistics',
  'Optimization Techniques',
  'Discrete Mathematics',
  'Database Management System',
  'Data Structures',
  'Computer Organization and Operating System',
  'Machine Learning I',
  'Data Science Lab I',
  'Data Structures Lab',
  'Mathematical Statistics Lab',
  'Design and Analysis of Algorithms',
  'Applied Regression Analysis',
  'Numerical Analysis',
  'Machine Learning II',
  'Data Science Lab II',
  'Probability Theory and Stochastic Processes',
  'Data Warehousing and Business Intelligence',
  'Artificial Intelligence',
  'Advanced Artificial Intelligence',
  'Time Series Analysis',
  'Data Analysis and Visualization',
  'Big Data Analytics',
  'Humans and Data',
  'Parallel and Distributed Computing',
  'Scientific Computing',
  'Statistical Simulation and Computation',
  'Natural Language Processing',
  'Deep Learning',
  'Survival Analysis',
  'Data Analysis and Decision Making',
  'Internet of Things'
];

export const RAW_EARTH_SCIENCES_SUBJECTS = [
  'Earth System Science',
  'Climate Science',
  'Geology',
  'Geophysics',
  'Environmental Science',
  'Environmental Chemistry',
  'Environmental Biology',
  'Hydrology',
  'Ocean/Marine Science',
  'Atmospheric Science',
  'Sustainability Science',
  'Environmental Pollution',
  'Water Resources',
  'GIS and Remote Sensing',
  'Earth Observation',
  'Environmental Modelling',
  'Climate Modelling',
  'Environmental Data Analysis'
];

export const RAW_MATHEMATICS_SUBJECTS = [
  'Introduction to Real Analysis',
  'Introduction to Groups and Rings',
  'Linear Algebra',
  'Complex Analysis',
  'Metric Spaces',
  'Numerical Analysis',
  'Abstract Algebra',
  'Theory of Ordinary Differential Equations',
  'Probability Theory and Stochastic Processes',
  'Topology',
  'Multivariable Analysis',
  'Measure Theory and Integration',
  'Partial Differential Equations',
  'Commutative Algebra',
  'Algebraic Topology',
  'Representation Theory',
  'Applied Stochastic Analysis',
  'Numerical Solutions of Differential Equations',
  'Optimization Techniques and Linear Programming',
  'Number Theory',
  'Mathematics Lab',
  'Computing and Optimization Lab',
  'Data Structures/Data Structures Lab'
];

export const RAW_PHYSICS_SUBJECTS = [
  'Mathematical Methods in Physics I',
  'Classical Mechanics',
  'Statistical Mechanics',
  'Condensed Matter Physics I',
  'Condensed Matter Physics II',
  'Electronics',
  'Quantum Mechanics I',
  'Quantum Mechanics II',
  'Numerical Methods',
  'Mechanics II',
  'Experimental Methods',
  'Foundations of Quantum Mechanics',
  'Quantum Information',
  'Statistics and Data Analysis in Physical Sciences',
  'Advanced Physics Lab I',
  'Advanced Physics Lab II',
  'Semiconductor Physics',
  'Fluid Mechanics and Transport Phenomena',
  'Modeling Materials',
  'Machine Learning for Physical Sciences',
  'Finite Element Modelling',
  'Electrochemical Energy Systems',
  'Soft Matter and Polymers',
  'Atomic and Molecular Physics',
  'Quantum Transport',
  'Introduction to Cosmology',
  'Nuclear and Particle Physics',
  'Computer Interfacing',
  'Energy Materials Laboratory',
  'Battery and Fuel Cell Laboratory',
  'Organic Photovoltaic Devices Laboratory',
  'Renewable Energy Systems',
  'Optoelectronic Devices',
  'Thermal Transport and Thermoelectrics',
  'Statistical and Data Analysis Methods in Physical Sciences'
];

export const RAW_INTERDISCIPLINARY_SUBJECTS = [
  'Scientific Writing',
  'Science, Society and Ethics',
  'Intellectual Property Rights',
  'Entrepreneurship',
  'Management Principles',
  'Psychology',
  'Anthropology',
  'Music',
  'Health',
  'Economics',
  'Languages',
  'Philosophy'
];

// Helper to assemble full normalized subjects list
function buildSubjects(): SubjectItem[] {
  const list: SubjectItem[] = [];

  // Foundation
  RAW_FOUNDATION_SUBJECTS.forEach((item, idx) => {
    list.push({
      id: `fnd-${idx + 1}`,
      schoolId: 'foundation',
      name: item.name,
      code: item.code,
      year: item.year,
      semesters: item.semesters,
      isFoundation: true
    });
  });

  // Biology
  RAW_BIOLOGY_SUBJECTS.forEach((name, idx) => {
    const year = idx < 10 ? 3 : idx < 20 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'BIO';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `bio-${idx + 1}`,
      schoolId: 'biology',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Chemistry
  RAW_CHEMISTRY_SUBJECTS.forEach((name, idx) => {
    const year = idx < 12 ? 3 : idx < 24 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'CHM';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `chm-${idx + 1}`,
      schoolId: 'chemistry',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Data Science
  RAW_DATA_SCIENCE_SUBJECTS.forEach((name, idx) => {
    const year = idx < 10 ? 3 : idx < 20 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'DSC';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `dsc-${idx + 1}`,
      schoolId: 'data-science',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Earth Sciences
  RAW_EARTH_SCIENCES_SUBJECTS.forEach((name, idx) => {
    const year = idx < 6 ? 3 : idx < 12 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'EES';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `ees-${idx + 1}`,
      schoolId: 'earth-sciences',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Mathematics
  RAW_MATHEMATICS_SUBJECTS.forEach((name, idx) => {
    const year = idx < 8 ? 3 : idx < 16 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'MTH';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `mth-${idx + 1}`,
      schoolId: 'mathematics',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Physics
  RAW_PHYSICS_SUBJECTS.forEach((name, idx) => {
    const year = idx < 11 ? 3 : idx < 22 ? 4 : 5;
    const sem = year === 3 ? [5, 6] : year === 4 ? [7, 8] : [9, 10];
    const prefix = 'PHY';
    const num = 300 + (idx * 5) + 1;
    list.push({
      id: `phy-${idx + 1}`,
      schoolId: 'physics',
      name,
      code: `${prefix}${num}`,
      year,
      semesters: sem,
      isFoundation: false
    });
  });

  // Interdisciplinary
  RAW_INTERDISCIPLINARY_SUBJECTS.forEach((name, idx) => {
    list.push({
      id: `idc-${idx + 1}`,
      schoolId: 'interdisciplinary',
      name,
      code: `IDC${200 + idx * 10}`,
      year: idx < 6 ? 2 : 3,
      semesters: idx < 6 ? [3, 4] : [5, 6],
      isFoundation: false
    });
  });

  return list;
}

export const ALL_SUBJECTS = buildSubjects();
