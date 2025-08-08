const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, mailBody) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1> ${mailBody} </h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is text format",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async (subject,mailBody) => {
  const sendEmailCommand = createSendEmailCommand(
    "shilpesh.test007@gmail.com",
    "thakur.shilpesh007@gmail.com",
    subject,
    mailBody
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    console.log(caught);
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports =  { run };