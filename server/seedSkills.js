const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./src/models/Skill');

dotenv.config();

const skills = [
    { name: 'JavaScript', category: 'Language' },
    { name: 'Python', category: 'Language' },
    { name: 'Java', category: 'Language' },
    { name: 'React', category: 'Frontend' },
    { name: 'Angular', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'MongoDB', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Swift', category: 'Mobile' },
    { name: 'kotlin', category: 'Mobile' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Figma', category: 'Design' },
    { name: 'TensorFlow', category: 'Data Science' }
];

const seedSkills = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Skill.deleteMany(); // Clear existing
        console.log('Skills cleared');

        await Skill.insertMany(skills);
        console.log('Skills seeded successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedSkills();
