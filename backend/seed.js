require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Ad = require('./models/Ad');
const bcrypt = require('bcrypt');

(async function seed(){
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/newsapp');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Ad.deleteMany({});

    const passwordHash = await bcrypt.hash('AdminPass123', 10);
    const admin = await User.create({ name:'Admin', email:'admin@example.com', passwordHash, role:'admin', verified:true });

    const cats = ['World','Technology','Sports','Business'].map(name => ({ name, slug: name.toLowerCase() }));
    await Category.insertMany(cats);

    await Ad.create({ name: 'Top Banner', position:'top', html: '<div style="background:#eee;padding:10px;text-align:center;">Sample Top Ad</div>', active:true });
    await Ad.create({ name: 'Sidebar Ad', position:'sidebar', html: '<div style="background:#ddd;padding:10px;text-align:center;">Sample Sidebar Ad</div>', active:true });

    console.log('Seeded admin, categories, ads');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
