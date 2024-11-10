import React from 'react';
import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';

const NotFound: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
}: GetServerSidePropsContext) => {
  res.statusCode = 404;
  return { props: {} };

};

export default NotFound;