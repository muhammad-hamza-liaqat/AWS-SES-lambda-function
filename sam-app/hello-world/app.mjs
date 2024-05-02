const AWS = require("aws-sdk");
const secretsManager = new AWS.SecretsManager();
const ses = new AWS.SES();

exports.handler = async (event) => {
  try {
    const data = await secretsManager
      .getSecretValue({ SecretId: "your-secret-id" })
      .promise();

    const secret = JSON.parse(data.SecretString);

    const region = secret.aws_region;
    const accessKeyId = secret.access_key_id;
    const secretAccessKey = secret.aws_secret_access_key;

    const sesWithCredentials = new AWS.SES({
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const { to, subject, body } = JSON.parse(event.body);

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: "sender@example.com",
    };

    await sesWithCredentials.sendEmail(params).promise();

    return { statusCode: 200, body: "Email sent successfully" };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: "Error sending email" };
  }
};
