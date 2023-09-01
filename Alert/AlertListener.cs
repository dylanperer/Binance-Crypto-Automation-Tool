using System.Net.Mail;
using System;
using System.Threading;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Search;
using MimeKit;
using Serilog;

namespace Noctua.Alert
{
    public class AlertListener
    {
        public AlertListener() {
            // Email server details
            string server = "your-email-server.com";
            int port = 993;
            bool useSsl = true;
            string username = "your-email-username";
            string password = "your-email-password";


            // Create and configure the email client
            var client = new ImapClient();
            client.Connect(server, port, useSsl);
            client.Authenticate(username, password);

            // Continuously check for new emails
            while (true)
            {
                // Fetch all unread emails
                client.Inbox.Open(FolderAccess.ReadWrite);
                var uids = client.Inbox.Search(SearchQuery.NotSeen);

                foreach (var uid in uids)
                {
                    var message = client.Inbox.GetMessage(uid);
                    Log.Information("Subject: {Subject}", message.Subject);
                    Log.Information("Body: {Body}", message.TextBody);
                }

                // Mark the fetched emails as read
                client.Inbox.AddFlags(uids, MessageFlags.Seen);

                // Wait for 1 minute before checking for new emails again
                Thread.Sleep(TimeSpan.FromMinutes(1));
            }

            client.Disconnect(true);
        }
    }
}



    
