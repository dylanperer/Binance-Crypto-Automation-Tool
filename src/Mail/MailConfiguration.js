"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailConfiguration = void 0;
const getCredentials = () => {
    const email = process.env.EMAIL_ADDRESS;
    const password = process.env.EMAIL_PASSWORD;
    if (!email || !password) {
        throw new Error("getAlertConfiguration() -> invalid email or password");
    }
    return { email, password };
};
const getMailConfiguration = () => {
    const { email, password } = getCredentials();
    return {
        username: email,
        password: password,
        host: "outlook.office365.com",
        port: 993,
        tls: true,
        connTimeout: 10000,
        authTimeout: 5000,
        debug: null,
        autotls: "never",
        tlsOptions: {
            rejectUnauthorized: false,
        },
        mailbox: "INBOX",
        searchFilter: ["UNSEEN"],
        markSeen: true,
        fetchUnreadOnStart: false,
        attachments: false,
    };
};
exports.getMailConfiguration = getMailConfiguration;
