import AWS from "aws-sdk";

export const lambdaHandler = async (event, context) => {
  const ses = new AWS.SES();
  const { recipientEmail, emailSubject, emailBody } = event.body; 
  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: emailBody || "", 
        },
      },
      Subject: {
        Data: emailSubject || "", 
      },
    },
    Source: "sender@example.com",
  };
  try {
    const data = await ses.sendEmail(params).promise();
    console.log("Email sent!", data);
    return {
      statusCode: 200,
      body: JSON.stringify("Email sent successfully!")
    };
  } catch (error) {
    console.error("Error sending the email", error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error in sending the email")
    };
  }
};
