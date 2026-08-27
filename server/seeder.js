import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from './models/User.js';
import Category from './models/Category.js';
import Book from './models/Book.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import Payment from './models/Payment.js';

dotenv.config();

export const sampleCategories = [
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Master full-stack, software engineering, algorithms, and web development technologies.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    icon: 'Code'
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Foundational computer science, distributed systems, architecture, and cloud computing.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    icon: 'Cpu'
  },
  {
    name: 'Fiction',
    slug: 'fiction',
    description: 'Immerse yourself in world-class literary fiction, sci-fi masterpieces, and gripping thrillers.',
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    icon: 'BookOpen'
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Strategic leadership, venture capital, entrepreneurship, and economics.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    icon: 'TrendingUp'
  },
  {
    name: 'Self Help',
    slug: 'self-help',
    description: 'Transform habits, sharpen focus, master psychology, and elevate personal productivity.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
    icon: 'Smile'
  },
  {
    name: 'Biography',
    slug: 'biography',
    description: 'Fascinating life stories of visionary leaders, scientists, artists, and innovators.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    icon: 'User'
  }
];

export const sampleBooks = [
  // Programming & CS (Prices between ₹59 and ₹199)
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. Clean Code is a revolutionary guide to writing elegant, readable, and maintainable software.',
    category: 'Programming',
    price: 189,
    discountPrice: 149,
    stock: 25,
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    language: 'English',
    pages: 464,
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 128,
    featured: true,
    bestSeller: true,
    tags: ['coding', 'clean code', 'craftsmanship', 'software engineering']
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. Martin Kleppmann helps you navigate this diverse landscape by examining the pros and cons of various technologies for processing and storing data.',
    category: 'Computer Science',
    price: 199,
    discountPrice: 169,
    stock: 18,
    isbn: '978-1449373320',
    publisher: "O'Reilly Media",
    language: 'English',
    pages: 616,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 95,
    featured: true,
    bestSeller: true,
    tags: ['databases', 'system design', 'distributed systems', 'architecture']
  },
  {
    title: 'JavaScript: The Definitive Guide (7th Edition)',
    author: 'David Flanagan',
    description: 'Since 1996, JavaScript: The Definitive Guide has been the bible for JavaScript programmers—a programmer’s guide and a comprehensive reference to the core language and to the web browser APIs defined by the Web standard.',
    category: 'Programming',
    price: 179,
    discountPrice: 139,
    stock: 14,
    isbn: '978-1491952023',
    publisher: "O'Reilly Media",
    language: 'English',
    pages: 704,
    image: 'https://images.unsplash.com/photo-1579468118864-ddb585c4b305?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    numReviews: 74,
    featured: false,
    bestSeller: true,
    tags: ['javascript', 'frontend', 'es6', 'web development']
  },
  {
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    description: 'The Pragmatic Programmer is one of those rare tech books you will read, re-read, and read to your team. Filled with practical advice on everything from career development to architectural design.',
    category: 'Programming',
    price: 169,
    discountPrice: 129,
    stock: 30,
    isbn: '978-0135957059',
    publisher: 'Addison-Wesley',
    language: 'English',
    pages: 352,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 110,
    featured: true,
    bestSeller: true,
    tags: ['pragmatic', 'software development', 'career', 'best practices']
  },
  {
    title: 'Introduction to Algorithms (CLRS 4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    description: 'A comprehensive update of the leading algorithms text, with new material on matchings in bipartite graphs, online algorithms, machine learning, and other topics. Widely regarded as the definitive reference.',
    category: 'Computer Science',
    price: 199,
    discountPrice: 159,
    stock: 12,
    isbn: '978-0262046305',
    publisher: 'MIT Press',
    language: 'English',
    pages: 1312,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 64,
    featured: false,
    bestSeller: false,
    tags: ['algorithms', 'data structures', 'cs', 'clrs']
  },
  {
    title: 'Full-Stack React, TypeScript, and Node',
    author: 'David Choi',
    description: 'Build enterprise-grade full-stack web applications with React 18, TypeScript, Node.js, Express, and modern NoSQL cloud databases.',
    category: 'Programming',
    price: 149,
    discountPrice: 119,
    stock: 22,
    isbn: '978-1800567184',
    publisher: 'Packt Publishing',
    language: 'English',
    pages: 512,
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    numReviews: 45,
    featured: true,
    bestSeller: false,
    tags: ['mern', 'react', 'typescript', 'fullstack']
  },

  // Fiction (Prices ₹59 to ₹199)
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are done for. Except that right now, he doesn’t know that. A riveting tale of interstellar survival.',
    category: 'Fiction',
    price: 119,
    discountPrice: 89,
    stock: 40,
    isbn: '978-0593135204',
    publisher: 'Ballantine Books',
    language: 'English',
    pages: 496,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 210,
    featured: true,
    bestSeller: true,
    tags: ['sci-fi', 'space', 'survival', 'bestseller']
  },
  {
    title: 'Dune (Deluxe Edition)',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange.',
    category: 'Fiction',
    price: 139,
    discountPrice: 99,
    stock: 35,
    isbn: '978-0441013593',
    publisher: 'Ace Books',
    language: 'English',
    pages: 688,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 185,
    featured: true,
    bestSeller: true,
    tags: ['dune', 'sci-fi', 'epic', 'classic']
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. An enchanting, deeply moving journey.',
    category: 'Fiction',
    price: 99,
    discountPrice: 69,
    stock: 28,
    isbn: '978-0525559474',
    publisher: 'Viking',
    language: 'English',
    pages: 304,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    numReviews: 140,
    featured: false,
    bestSeller: true,
    tags: ['fiction', 'philosophical', 'bestseller', 'fantasy']
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson’s life is seemingly perfect. One evening she shoots her husband five times in the face, and then never speaks another word. A shocking psychological thriller with an unforgettable twist.',
    category: 'Fiction',
    price: 89,
    discountPrice: 59,
    stock: 19,
    isbn: '978-1250301697',
    publisher: 'Celadon Books',
    language: 'English',
    pages: 336,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    numReviews: 92,
    featured: false,
    bestSeller: false,
    tags: ['thriller', 'mystery', 'psychological']
  },

  // Business & Economics (Prices ₹59 to ₹199)
  {
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel, Blake Masters',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.',
    category: 'Business',
    price: 129,
    discountPrice: 99,
    stock: 35,
    isbn: '978-0804139298',
    publisher: 'Crown Business',
    language: 'English',
    pages: 224,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 160,
    featured: true,
    bestSeller: true,
    tags: ['startups', 'entrepreneurship', 'venture capital', 'technology']
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.',
    category: 'Business',
    price: 119,
    discountPrice: 79,
    stock: 50,
    isbn: '978-0857197689',
    publisher: 'Harriman House',
    language: 'English',
    pages: 256,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 240,
    featured: true,
    bestSeller: true,
    tags: ['finance', 'investing', 'money', 'psychology']
  },
  {
    title: 'Principles: Life and Work',
    author: 'Ray Dalio',
    description: 'Ray Dalio, one of the world’s most successful investors and entrepreneurs, shares the unconventional principles that he’s developed, refined, and used over the past forty years to create unique results.',
    category: 'Business',
    price: 189,
    discountPrice: 149,
    stock: 15,
    isbn: '978-1501124020',
    publisher: 'Simon & Schuster',
    language: 'English',
    pages: 592,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    numReviews: 88,
    featured: false,
    bestSeller: false,
    tags: ['principles', 'leadership', 'economics', 'management']
  },

  // Self Help (Prices ₹59 to ₹199)
  {
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world’s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    category: 'Self Help',
    price: 149,
    discountPrice: 99,
    stock: 60,
    isbn: '978-0735211292',
    publisher: 'Avery',
    language: 'English',
    pages: 320,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    numReviews: 310,
    featured: true,
    bestSeller: true,
    tags: ['habits', 'productivity', 'self improvement', 'mindset']
  },
  {
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information and produce better results in less time.',
    category: 'Self Help',
    price: 129,
    discountPrice: 89,
    stock: 25,
    isbn: '978-1455586691',
    publisher: 'Grand Central Publishing',
    language: 'English',
    pages: 304,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 145,
    featured: false,
    bestSeller: true,
    tags: ['focus', 'productivity', 'cal newport', 'deep work']
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'In the international bestseller, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    category: 'Self Help',
    price: 159,
    discountPrice: 119,
    stock: 18,
    isbn: '978-0374533557',
    publisher: 'Farrar, Straus and Giroux',
    language: 'English',
    pages: 512,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    numReviews: 120,
    featured: false,
    bestSeller: false,
    tags: ['psychology', 'decision making', 'behavioral science']
  },

  // Biography (Prices ₹59 to ₹199)
  {
    title: 'Elon Musk',
    author: 'Walter Isaacson',
    description: 'From the author of Steve Jobs and other bestselling biographies, this is the astonishingly intimate story of the most fascinating and controversial innovator of our era—a rule-breaking visionary who helped to lead the world into the era of electric vehicles, private space exploration, and artificial intelligence.',
    category: 'Biography',
    price: 199,
    discountPrice: 159,
    stock: 30,
    isbn: '978-1982181284',
    publisher: 'Simon & Schuster',
    language: 'English',
    pages: 688,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    numReviews: 175,
    featured: true,
    bestSeller: true,
    tags: ['biography', 'elon musk', 'walter isaacson', 'innovation']
  },
  {
    title: 'Steve Jobs: The Exclusive Biography',
    author: 'Walter Isaacson',
    description: 'Based on more than forty interviews with Steve Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.',
    category: 'Biography',
    price: 189,
    discountPrice: 139,
    stock: 22,
    isbn: '978-1451648539',
    publisher: 'Simon & Schuster',
    language: 'English',
    pages: 656,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 190,
    featured: false,
    bestSeller: true,
    tags: ['steve jobs', 'apple', 'biography', 'technology']
  },
  {
    title: 'Shoe Dog: A Memoir by the Creator of Nike',
    author: 'Phil Knight',
    description: 'In this candid and riveting memoir, Nike founder and CEO Phil Knight shares the inside story of the company’s early days as an intrepid start-up and its evolution into one of the world’s most iconic, game-changing, and profitable brands.',
    category: 'Biography',
    price: 139,
    discountPrice: 99,
    stock: 28,
    isbn: '978-1501135927',
    publisher: 'Scribner',
    language: 'English',
    pages: 400,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    numReviews: 165,
    featured: true,
    bestSeller: true,
    tags: ['nike', 'shoe dog', 'entrepreneurship', 'memoir']
  }
];

export const seedDataDirect = async () => {
  try {
    console.log('Seeding initial collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Payment.deleteMany({});

    const adminUser = await User.create({
      name: 'Pratham Shahi',
      email: 'prathamm0001@gmail.com',
      password: 'Pratham@05',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      addresses: [
        {
          fullName: 'Pratham Shahi',
          phone: '+91 9876543210',
          addressLine: 'Tech Innovation Hub, Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
          isDefault: true
        }
      ]
    });

    // Also seed default admin@bookcart.com for backward compatibility
    await User.create({
      name: 'BookCart Admin',
      email: 'admin@bookcart.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    });

    const regularUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@bookcart.com',
      password: 'User@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      addresses: [
        {
          fullName: 'Alex Johnson',
          phone: '+91 9123456780',
          addressLine: 'Apartment 14B, Greenview Towers, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true
        }
      ]
    });

    await Category.insertMany(sampleCategories);
    const createdBooks = await Book.insertMany(sampleBooks);

    if (createdBooks.length > 0) {
      await Review.create([
        {
          user: regularUser._id,
          book: createdBooks[0]._id,
          rating: 5,
          comment: 'Every software engineer must read this book! The principles on function naming, single responsibility, and refactoring drastically improved my coding standard.',
          isVerifiedPurchase: true
        },
        {
          user: regularUser._id,
          book: createdBooks[1]._id,
          rating: 5,
          comment: 'The gold standard for understanding distributed systems, replication, partitioning, and stream processing. Clear diagrams and deep insights.',
          isVerifiedPurchase: true
        },
        {
          user: regularUser._id,
          book: createdBooks[13]._id,
          rating: 5,
          comment: 'An absolute masterpiece on behavioral psychology and self discipline. The concept of 1% improvement compounding daily is life-changing.',
          isVerifiedPurchase: true
        }
      ]);

      await Order.create({
        user: regularUser._id,
        orderItems: [
          {
            book: createdBooks[0]._id,
            title: createdBooks[0].title,
            image: createdBooks[0].image,
            price: createdBooks[0].discountPrice || createdBooks[0].price,
            quantity: 1
          },
          {
            book: createdBooks[13]._id,
            title: createdBooks[13].title,
            image: createdBooks[13].image,
            price: createdBooks[13].discountPrice || createdBooks[13].price,
            quantity: 1
          }
        ],
        shippingAddress: regularUser.addresses[0],
        paymentMethod: 'Razorpay',
        paymentResult: {
          id: 'pay_demo_seeder_001',
          status: 'captured',
          razorpayOrderId: 'order_demo_seeder_001',
          razorpayPaymentId: 'pay_demo_seeder_001',
          razorpaySignature: 'mock_signature'
        },
        subtotal: 248,
        shippingPrice: 50,
        discount: 90,
        totalPrice: 208,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        orderStatus: 'Delivered',
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Order placed' },
          { status: 'Processing', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Packed' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'In transit' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Delivered' }
        ]
      });
    }

    console.log('✅ Seed Data Injected (20+ Books with prices ₹59-₹199, Categories, Demo Accounts, Reviews)!');
  } catch (err) {
    console.error('Seeder injection error:', err.message);
  }
};

const runSeederCLI = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookcart';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    } catch (e) {
      console.log('Using in-memory instance for standalone seed verification...');
      const mem = await MongoMemoryServer.create();
      await mongoose.connect(mem.getUri());
    }

    await seedDataDirect();
    console.log('----------------------------------------------------');
    console.log('🔑 Demo Admin Account:');
    console.log('   Email:    admin@bookcart.com');
    console.log('   Password: Admin@123');
    console.log('----------------------------------------------------');
    console.log('👤 Demo Customer Account:');
    console.log('   Email:    user@bookcart.com');
    console.log('   Password: User@123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`❌ CLI Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  runSeederCLI();
}
