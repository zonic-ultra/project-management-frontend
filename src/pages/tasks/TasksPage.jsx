import React from "react";
import Layout from "../../components/Layout";

const TasksPage = () => {
  return (
    <Layout>
      <div className='py-8'>
        <h1 className='text-3xl font-bold mb-8'>Tasks</h1>
        <div className='bg-prussian-blue/50 backdrop-blur-md rounded-xl p-6 border border-lavender-grey/10'>
          <p className='text-lavender-grey'>
            Task management interface will be implemented here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage;
