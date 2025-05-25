const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Recipe = require('./models/Recipe');

const MONGO_URI = 'mongodb://localhost:27017/cooking_platform';

const recipesData = [
  {
    title: 'Μουσακάς',
    preparationTime: '30 λεπτά',
    cookingTime: '60 λεπτά',
    ingredients: 'Μελιτζάνες, κιμάς, πατάτες, μπεσαμέλ',
    instructions: 'Στρώσεις μελιτζάνας, κιμά, μπεσαμέλ και ψήσιμο.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/2136/mousakas-thumb.jpg'
  },
  {
    title: 'Παστίτσιο',
    preparationTime: '25 λεπτά',
    cookingTime: '45 λεπτά',
    ingredients: 'Μακαρόνια, κιμάς, μπεσαμέλ, τυρί',
    instructions: 'Στρώσεις μακαρονιών, κιμά και μπεσαμέλ, ψήνουμε στο φούρνο.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/2272/pastitsio-thumb.jpg'
  },
  {
    title: 'Κοτόπουλο λεμονάτο',
    preparationTime: '15 λεπτά',
    cookingTime: '50 λεπτά',
    ingredients: 'Κοτόπουλο, λεμόνι, πατάτες, ρίγανη',
    instructions: 'Ψήνουμε κοτόπουλο με λεμόνι και πατάτες στο φούρνο.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/1950/kotopoulo-lemonato-thumb.jpg'
  },
  {
    title: 'Γεμιστά',
    preparationTime: '30 λεπτά',
    cookingTime: '90 λεπτά',
    ingredients: 'Ντομάτες, πιπεριές, ρύζι, κιμάς (προαιρετικά)',
    instructions: 'Γεμίζουμε τα λαχανικά με γέμιση ρυζιού και ψήνουμε.',
    imageUrl: 'https://www.sintagespareas.gr/images/recipes/3.jpg'
  },
  {
    title: 'Σουτζουκάκια Σμυρνέικα',
    preparationTime: '20 λεπτά',
    cookingTime: '40 λεπτά',
    ingredients: 'Κιμάς, σκόρδο, κύμινο, ντομάτα',
    instructions: 'Τηγανίζουμε τα σουτζουκάκια και τα σιγοβράζουμε σε σάλτσα ντομάτας.',
    imageUrl: 'https://www.olive.gr/sites/default/files/styles/large/public/recipes/soutzoukakia-smirneika.jpg'
  },
  {
    title: 'Γιουβαρλάκια Αυγολέμονο',
    preparationTime: '20 λεπτά',
    cookingTime: '30 λεπτά',
    ingredients: 'Κιμάς, ρύζι, αυγολέμονο',
    instructions: 'Βράζουμε τα γιουβαρλάκια και προσθέτουμε αυγολέμονο.',
    imageUrl: 'https://www.sintagespareas.gr/images/recipes/1495.jpg'
  },
  {
    title: 'Κολοκυθοκεφτέδες',
    preparationTime: '15 λεπτά',
    cookingTime: '15 λεπτά',
    ingredients: 'Κολοκύθια, φέτα, άνηθος, αυγό',
    instructions: 'Πλάθουμε κεφτεδάκια με κολοκύθι και τηγανίζουμε.',
    imageUrl: 'https://www.olive.gr/sites/default/files/recipes/kolokythokeftedes.jpg'
  },
  {
    title: 'Σπανακόπιτα',
    preparationTime: '30 λεπτά',
    cookingTime: '45 λεπτά',
    ingredients: 'Σπανάκι, φέτα, φύλλο κρούστας',
    instructions: 'Φτιάχνουμε γέμιση με σπανάκι και φέτα, την κλείνουμε σε φύλλο και ψήνουμε.',
    imageUrl: 'https://www.sintagespareas.gr/images/recipes/1005.jpg'
  },
  {
    title: 'Χωριάτικη Σαλάτα',
    preparationTime: '10 λεπτά',
    cookingTime: '0 λεπτά',
    ingredients: 'Ντομάτα, αγγούρι, ελιά, φέτα, ρίγανη, ελαιόλαδο',
    instructions: 'Ανακατεύουμε όλα τα υλικά σε μπολ.',
    imageUrl: 'https://www.sintagespareas.gr/images/recipes/50.jpg'
  },
  {
    title: 'Μπριάμ',
    preparationTime: '20 λεπτά',
    cookingTime: '60 λεπτά',
    ingredients: 'Κολοκύθια, πατάτες, μελιτζάνες, ντομάτες, κρεμμύδι',
    instructions: 'Ανακατεύουμε τα λαχανικά και τα ψήνουμε στο φούρνο.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/2502/briam-thumb.jpg'
  },
  {
    title: 'Πίτα Γύρος Χοιρινός',
    preparationTime: '20 λεπτά',
    cookingTime: '10 λεπτά',
    ingredients: 'Πίτα, χοιρινό γύρος, τζατζίκι, πατάτες, ντομάτα',
    instructions: 'Τυλίγουμε τα υλικά σε πίτα.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/2833/pita-gyro.jpg'
  },
  {
    title: 'Κριθαρότο με μανιτάρια',
    preparationTime: '10 λεπτά',
    cookingTime: '25 λεπτά',
    ingredients: 'Κριθαράκι, μανιτάρια, παρμεζάνα, κρέμα γάλακτος',
    instructions: 'Σιγοβράζουμε το κριθαράκι με μανιτάρια και κρέμα.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/2297/kritharoto-manitaria-thumb.jpg'
  },
  {
    title: 'Λουκουμάδες με μέλι',
    preparationTime: '15 λεπτά',
    cookingTime: '20 λεπτά',
    ingredients: 'Αλεύρι, μαγιά, μέλι, κανέλα',
    instructions: 'Τηγανίζουμε λουκουμάδες και περιχύνουμε με μέλι και κανέλα.',
    imageUrl: 'https://akispetretzikis.com/uploads/recipes/1556/loukoumades-thumb.jpg'
  }
];


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Ο admin υπάρχει ήδη');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new User({
      username: 'admin',
      passwordHash: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Admin δημιουργήθηκε με επιτυχία');

    // // Recipes
    // await Recipe.deleteMany({});
    // await Recipe.insertMany(recipesData);
    // console.log('✅ 15 Recipes inserted');

    mongoose.disconnect();
    console.log('Seed completed');
  } catch (err) {
    console.error('❌ Seed error:', err);
    mongoose.disconnect();
  }
}

seed();