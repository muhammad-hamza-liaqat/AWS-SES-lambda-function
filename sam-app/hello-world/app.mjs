const AWS = require("aws-sdk");
const secretsManager = new AWS.SecretsManager();
const ses = new AWS.SES();

exports.handler = async (event) => {
  try {
    const data = await secretsManager
      .getSecretValue({ SecretId: "your-secret-id" })
      .promise();

    const secret = JSON.parse(data.SecretString);

    const region = secret.AWS_REGION;
    const accessKeyId = secret.AWS_ACCESS_KEY_ID;
    const secretAccessKey = secret.AWS_SECRET_ACCESS_KEY;

    // Configure AWS
    AWS.config.update({
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    // Send email using SES
    const params = {
      Destination: {
        ToAddresses: ["recipient@example.com"],
      },
      Message: {
        Body: {
          Text: {
            Data: "This is a test email sent from AWS Lambda.",
          },
        },
        Subject: {
          Data: "Test Email from AWS Lambda",
        },
      },
      Source: "sender@example.com",
    };

    await ses.sendEmail(params).promise();

    return { statusCode: 200, body: "Email sent successfully" };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: "Error sending email" };
  }
};
