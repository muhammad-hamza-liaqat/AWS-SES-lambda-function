// const aws = require("aws-sdk");

// export const lambdaHandler = async (event, context) => {
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'hello world',
//       })
//     };

//     return response;
//   };

const aws = require("aws-sdk");

exports.handler = async (event, context) => {
  const ses = new aws.SES();
  const { recipientEmail, emailSubject, emailBody } = event;
  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: emailBody,
        },
      },
      Subject: {
        Data: emailSubject,
      },
    },
    Source: "sender@example.com",
  };
  try {
    const data = await ses.sendEmail(params).promise();
    console.log("email send!", data);
    return {
      statusCode: 200,
      body: JSON.stringify("email sent successfully!")
    }
    
  } catch (error) {
    console.error ("error sending the email", error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify("error in sending the email")
    }
  }
};
