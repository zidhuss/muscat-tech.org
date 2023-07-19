// This file defines a serverless netlify function that receives a tally webhook on form submission.
// It then sends a confirmation email to the user that submitted the form.

const postmark = require("postmark");

exports.handler = async function (event, context) {
  const data = JSON.parse(event.body).data;
  console.log(data);
  return {
    statusCode: 200,
  };
};
