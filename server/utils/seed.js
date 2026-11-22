require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    console.log('Seeding initial data...');

    // 1. Ensure Hirer Admin exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cateringportal.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      admin = await User.create({
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'hirer',
      });
      console.log(`Created Hirer Admin: ${admin.email}`);
    } else {
      console.log(`Hirer Admin already exists: ${admin.email}`);
    }

    // 2. Check if jobs exist
    const jobCount = await Job.countDocuments();
    let jobs = [];
    if (jobCount === 0) {
      jobs = await Job.create([
        {
          title: 'Part-Time Catering Staff & Food Servers',
          description:
            'Looking for well-mannered catering staff for an upcoming luxury wedding reception. Responsibilities include serving appetizers, table setup, refilling hot chafing dishes, and attending to guests with warmth and courtesy.',
          location: 'Dhanmondi Club, Dhaka',
          salary: '1,200 BDT / Day + Meal',
          jobType: 'Part-Time',
          vacancies: 8,
          eventDate: 'Next Friday (05:00 PM - 11:30 PM)',
          shiftTimings: 'Evening Shift (6.5 hours)',
          requirements: [
            'Pleasant grooming and clean presentation',
            'Basic knowledge of food hygiene and table etiquette',
            'Punctual and reliable team player',
            'Fluent in conversational Bangla, basic English is a plus',
          ],
          status: 'active',
          postedBy: admin._id,
        },
        {
          title: 'Buffet Banquet Service Associate',
          description:
            'Energetic associates needed for an international corporate summit gala dinner. You will oversee buffet counters, keep serving areas immaculate, manage live carving counters, and ensure top-tier guest satisfaction.',
          location: 'Radisson Blu Water Garden, Gulshan, Dhaka',
          salary: '1,500 BDT / Day + Transport Allowance',
          jobType: 'Event-Based',
          vacancies: 10,
          eventDate: 'Upcoming Saturday (02:00 PM - 10:30 PM)',
          shiftTimings: 'Afternoon & Evening',
          requirements: [
            'Prior banquet or restaurant serving experience preferred',
            'Strong physical stamina for standing and movement',
            'Black trousers and polished black shoes required (white shirt provided)',
          ],
          status: 'active',
          postedBy: admin._id,
        },
        {
          title: 'VIP Lounge Host & Silver Service Steward',
          description:
            'High-profile VIP private banquet seeking refined service stewards experienced in Silver Service and VIP protocol. High tipping potential and excellent work environment.',
          location: 'Banani Lakefront Convention Center, Dhaka',
          salary: '2,000 BDT / Day',
          jobType: 'Part-Time',
          vacancies: 4,
          eventDate: 'Every Weekend',
          shiftTimings: '06:00 PM - 12:00 AM',
          requirements: [
            'Minimum 1 year hospitality or fine-dining catering experience',
            'Exceptional communication and silver service plate handling',
            'Age 20-30 with positive attitude',
          ],
          status: 'active',
          postedBy: admin._id,
        },
        {
          title: 'Back-of-House Kitchen Steward & Dishwashing Crew',
          description:
            'Assisting our culinary team during high-capacity events. Loading/unloading catering utensils, maintaining sanitization standards, and dish handling in dish pit area.',
          location: 'Mirpur DOHS Convention Hall, Dhaka',
          salary: '1,000 BDT / Day + Dinner',
          jobType: 'Part-Time',
          vacancies: 6,
          eventDate: 'Multiple Dates Available',
          shiftTimings: '04:00 PM - 11:00 PM',
          requirements: [
            'Hardworking and cooperative personality',
            'No strict prior experience required - on-site training provided',
            'Able to lift catering crates (up to 15kg)',
          ],
          status: 'active',
          postedBy: admin._id,
        },
      ]);
      console.log(`Seeded ${jobs.length} catering jobs.`);
    } else {
      jobs = await Job.find();
    }

    // 3. Seed Sample Applicants if none exist
    const applicantUserCount = await User.countDocuments({ role: 'applicant' });
    if (applicantUserCount === 0) {
      // User 1
      const user1 = await User.create({
        email: 'applicant1@cateringportal.com',
        password: 'Password@123',
        role: 'applicant',
      });
      const app1 = await Applicant.create({
        userId: user1._id,
        fullName: 'Demo Candidate 1',
        phone: '01700000001',
        whatsapp: '01700000001',
        hometown: 'Dhaka',
        experience: '2 years working as part-time banquet server in Dhanmondi and Uttara wedding halls.',
        profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        cv: {
          fileName: 'sample_resume.pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 145000,
          uploadedAt: new Date(),
        },
        additionalPictures: [
          {
            url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
            caption: 'Serving at winter wedding buffet 2025',
          },
        ],
        skills: ['Food Serving', 'Table Setup', 'Beverage Refills', 'Banquet Etiquette'],
        bio: 'Passionate and energetic catering steward seeking weekend catering jobs across Dhaka.',
      });

      // User 2
      const user2 = await User.create({
        email: 'applicant2@cateringportal.com',
        password: 'Password@123',
        role: 'applicant',
      });
      const app2 = await Applicant.create({
        userId: user2._id,
        fullName: 'Demo Candidate 2',
        phone: '01800000002',
        whatsapp: '01800000002',
        hometown: 'Chittagong',
        experience: '1.5 years in hotel banquet halls and outdoor BBQ parties.',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        cv: {
          fileName: 'sample_resume.pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 182000,
          uploadedAt: new Date(),
        },
        skills: ['Buffet Management', 'Silver Service', 'Speed Serving'],
        bio: 'Reliable banquet server with experience in high-volume events.',
      });

      // User 3
      const user3 = await User.create({
        email: 'applicant3@cateringportal.com',
        password: 'Password@123',
        role: 'applicant',
      });
      const app3 = await Applicant.create({
        userId: user3._id,
        fullName: 'Demo Candidate 3',
        phone: '01900000003',
        whatsapp: '01900000003',
        hometown: 'Dhaka',
        experience: '3 years VIP hospitality host and executive dining assistant.',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        cv: {
          fileName: 'sample_resume.pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 210000,
          uploadedAt: new Date(),
        },
        skills: ['VIP Hospitality', 'Silver Service', 'English & Bengali Communication', 'Guest Relations'],
        bio: 'Professional host seeking weekend and part-time catering contracts in Dhaka.',
      });

      console.log('Seeded 3 sample applicants.');

      // 4. Create sample applications with different statuses
      if (jobs.length > 0) {
        await Application.create([
          {
            applicantId: app1._id,
            userId: user1._id,
            jobId: jobs[0]._id,
            status: 'shortlisted',
            coverNote: 'Available this Friday evening. I have my own white formal shirt and black trousers.',
            notes: 'Contacted on WhatsApp. Confirmed availability for Dhanmondi event.',
          },
          {
            applicantId: app2._id,
            userId: user2._id,
            jobId: jobs[0]._id,
            status: 'pending',
            coverNote: 'Ready to work with the team.',
          },
          {
            applicantId: app3._id,
            userId: user3._id,
            jobId: jobs[1]._id,
            status: 'hired',
            coverNote: 'Excited to coordinate the VIP buffet counter.',
            notes: 'Top candidate. Assigned to Head Table VIP service.',
          },
          {
            applicantId: app1._id,
            userId: user1._id,
            jobId: jobs[2]._id,
            status: 'reviewed',
            coverNote: 'I also have silver service experience from winter 2024.',
          },
        ]);
        console.log('Seeded sample applications.');
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => {
    mongoose.disconnect();
    process.exit(0);
  });
}
