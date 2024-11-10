import React from 'react';
import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1>An Error Occurred</h1>
      <p>Sorry, something went wrong.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ErrorProps> = async ({
  res,
}: GetServerSidePropsContext) => {
  const statusCode = res ? res.statusCode : 404;
  return { props: { statusCode } };
};

export default Error;