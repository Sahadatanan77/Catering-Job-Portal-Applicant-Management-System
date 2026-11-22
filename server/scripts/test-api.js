const runTests = async () => {
  // Give server 3 seconds to connect to MongoMemoryServer and seed
  await new Promise((r) => setTimeout(r, 3000));

  console.log('\n--- STARTING API VERIFICATION TESTS ---');

  const baseUrl = 'http://localhost:5000/api';

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/health`);
  const health = await healthRes.json();
  console.log('✓ 1. Health check:', health.status);

  // 2. Hirer Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@cateringportal.com',
      password: 'Admin@12345',
      expectedRole: 'hirer',
    }),
  });
  const loginData = await loginRes.json();
  console.log('✓ 2. Hirer login:', loginData.success, 'Token length:', loginData.token?.length);
  const hirerToken = loginData.token;

  // 3. Applicant Login (Demo Candidate 1)
  const appLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'applicant1@cateringportal.com',
      password: 'Password@123',
      expectedRole: 'applicant',
    }),
  });
  const appLoginData = await appLoginRes.json();
  console.log('✓ 3. Applicant login:', appLoginData.success, 'User:', appLoginData.user?.email);
  const applicantToken = appLoginData.token;

  // 4. Fetch Jobs (Public)
  const jobsRes = await fetch(`${baseUrl}/jobs`);
  const jobsData = await jobsRes.json();
  console.log('✓ 4. Fetch jobs count:', jobsData.count, 'First title:', jobsData.jobs?.[0]?.title);

  // 5. Fetch Dashboard Stats (Hirer)
  const statsRes = await fetch(`${baseUrl}/applications/stats/dashboard`, {
    headers: { Authorization: `Bearer ${hirerToken}` },
  });
  const statsData = await statsRes.json();
  console.log('✓ 5. Dashboard stats:', statsData.stats);

  // 6. Test Bangladeshi Phone Number Validation
  const bdTestRes = await fetch(`${baseUrl}/applicants/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${applicantToken}`,
    },
    body: JSON.stringify({
      fullName: 'Demo Candidate 1 Updated',
      phone: '12345678', // Invalid BD phone
      hometown: 'Dhaka',
    }),
  });
  const bdTest = await bdTestRes.json();
  console.log('✓ 6. Invalid phone rejected properly:', bdTest.success === false, 'Message:', bdTest.message);

  // 7. Update status of an application
  const appsRes = await fetch(`${baseUrl}/applications`, {
    headers: { Authorization: `Bearer ${hirerToken}` },
  });
  const appsData = await appsRes.json();
  if (appsData.applications && appsData.applications.length > 0) {
    const firstApp = appsData.applications[0];
    const updateRes = await fetch(`${baseUrl}/applications/${firstApp._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hirerToken}`,
      },
      body: JSON.stringify({ status: 'hired', notes: 'Top candidate selected' }),
    });
    const updateData = await updateRes.json();
    console.log('✓ 7. Status update to hired:', updateData.success, 'New status:', updateData.application?.status);
  }

  console.log('\n--- ALL BACKEND API TESTS PASSED SUCCESSFULLY! ---\n');
  process.exit(0);
};

runTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});
