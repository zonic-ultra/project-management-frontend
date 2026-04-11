import React from "react";
import Layout from "../components/Layout";

const DashboardPage = () => {
  return (
    <Layout>
      <div className='py-8'>
        <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-prussian-blue/50 backdrop-blur-md rounded-xl p-6 border border-lavender-grey/10'>
            <h3 className='text-xl font-semibold mb-2'>Total Projects</h3>
            <p className='text-3xl font-bold text-dusk-blue'>12</p>
          </div>
          <div className='bg-prussian-blue/50 backdrop-blur-md rounded-xl p-6 border border-lavender-grey/10'>
            <h3 className='text-xl font-semibold mb-2'>Active Tasks</h3>
            <p className='text-3xl font-bold text-dusk-blue'>45</p>
          </div>
          <div className='bg-prussian-blue/50 backdrop-blur-md rounded-xl p-6 border border-lavender-grey/10'>
            <h3 className='text-xl font-semibold mb-2'>Team Members</h3>
            <p className='text-3xl font-bold text-dusk-blue'>8</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
