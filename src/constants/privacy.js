export const privacyText = `
# Privacy Policy for BMverse

_Last updated: 8th January 2026_

This Privacy Policy explains how **BMverse** (the mobile application) and the website **https://bmverse.bruu.eu** (together referred to as "BMverse", "we", "us", or "our") collect, use, store, and protect personal data. We take your privacy seriously and process personal data only to the extent necessary to operate the app and website.

## Privacy Summary

BMverse is designed with privacy in mind.

- We only collect your **email address** to let you sign in securely
- We use **passwordless authentication** (no passwords stored)
- We do **not** track you, show ads, or sell your data
- We do **not** share your data with third parties
- Your data is automatically deleted after **one year of inactivity**
- You can always re-register with the same email, but previous data will be lost

If you want the full legal details, please read the complete Privacy Policy below.

---

## 1. Scope

This Privacy Policy applies to:

- The **BMverse mobile application** (music fan app), distributed via AltStore
- The **BMverse website** (documentation and contact information)

It does **not** apply to third-party services that are not under our control, except where explicitly stated.

---

## 2. Data Controller

The data controller for the processing of personal data within BMverse is:

**BMverse Development Team**  
Contact details are provided on the website https://bmverse.bruu.eu/ at the contact page.

---

## 3. Authentication and User Accounts

### 3.1 Authentication Method

BMverse uses **Supabase Auth** to authenticate users via **passwordless email login**:

- Users enter their email address
- A **6-digit one-time authentication token** is sent to the provided email address
- No passwords are created or stored by BMverse

If an email address is not yet known to Supabase Auth, a new user account is automatically created. If the email address already exists, the user is authenticated.

### 3.2 Data Stored for Authentication

The following authentication-related data is stored by Supabase:

- Email address
- Account creation date
- Confirmation date
- Last sign-in date
- Last update timestamp

No names, passwords, or other identifying profile information are stored.

---

## 4. Personal Data Collected

### 4.1 Currently Collected Data

At present, BMverse only processes:

- **Email address** (for authentication purposes)
- **Authentication metadata** (see section 3.2)

No additional personal or profile data is collected.

### 4.2 Future Features

In the future, BMverse may introduce features such as:

- Music charts or rankings
- Game scores or similar in-app features

These features may require storing additional user-related data. If so:

- Only data necessary for the feature will be collected
- This Privacy Policy will be updated accordingly
- Users will be informed of material changes where required by law

---

## 5. Use of Personal Data

Personal data is used exclusively for:

- Providing authentication and secure access to the app
- Enabling app functionality
- Maintaining the security and integrity of the service
- Contacting users **only** in the event of a security-related issue where it is in the user’s interest

Personal data is **not** used for:

- Advertising
- Marketing
- Tracking
- Profiling

---

## 6. Data Retention and Deletion

### 6.1 Inactivity Deletion Policy

Personal and authentication-related data is automatically deleted after **one year of inactivity**.

Inactivity means no successful sign-in within a continuous 12-month period.

### 6.2 Re-registration

If a user signs in again with the same email address after deletion:

- A **new user account** is created
- All previously stored personal or app-related data is permanently lost

---

## 7. Data Sharing & Third Parties

- No personal data is sold or shared with third parties
- Data is not transferred for marketing or analytics purposes

### 7.1 Supabase

Authentication and database services are provided by **Supabase**. Supabase processes data solely to provide its services and acts as a data processor according to applicable data protection laws.

---

## 8. Email Communications

Emails are sent:

- As part of the authentication workflow (one-time login tokens)
- Only in case of a **security-related issue**, if contacting the user is necessary and in their interest

No newsletters, promotional emails, or marketing messages are sent.

---

## 9. Mobile App Distribution (AltStore)

The BMverse app is distributed via **AltStore**.

- We do not receive any personal data from AltStore
- We do not receive analytics or usage data tied to individual users from AltStore

---

## 10. Website Data Processing

The BMverse website:

- Does **not** collect personal data
- Does **not** use cookies for tracking or analytics
- Does **not** log or associate website access with identifiable users

The website serves documentation and provides contact information only.

---

## 11. Legal Basis (GDPR)

Under the General Data Protection Regulation (GDPR), personal data is processed based on:

- **Article 6(1)(b) GDPR** – performance of a contract (providing authentication and app functionality)
- **Article 6(1)(f) GDPR** – legitimate interest (security, abuse prevention, and operation of the service)

---

## 12. Supabase as Data Processor

BMverse uses **Supabase** as an infrastructure and authentication provider.

- Supabase acts as a **data processor** on behalf of BMverse
- Processing is limited to providing authentication, database, and infrastructure services
- Supabase processes personal data only according to our instructions and applicable data protection laws
- Appropriate technical and organizational measures are in place to protect personal data

BMverse has entered into a **Data Processing Agreement (DPA)** with Supabase in accordance with **Article 28 GDPR**.

---

## 12. User Rights

Users have the following rights under applicable data protection laws:

- Right of access
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to restriction of processing
- Right to data portability
- Right to object to processing

Requests can be made using the contact details provided on the website.

---

## 13. Data Security

We implement appropriate technical and organizational measures to protect personal data, including:

- Secure authentication via Supabase
- Restricted access to production systems
- Minimization of stored personal data

---

## 14. Changes to this Privacy Policy

This Privacy Policy may be updated from time to time to reflect:

- New features
- Legal requirements
- Changes in data processing practices

The latest version will always be available on the BMverse website.

---

## 15. Apple App Store Privacy Information

The following summary reflects the information required for Apple’s App Store privacy labels:

### Data Collected

- Email Address  
  Purpose: App functionality (authentication)  
  Linked to the user: Yes

### Data Not Collected

- Name
- Phone number
- Location data
- Contacts
- Photos or media
- Usage data
- Diagnostics
- Identifiers

### Data Use

- Data is used **only** for app functionality and security
- Data is **not** used for tracking
- Data is **not** used for advertising

### Tracking

- No tracking across apps or websites

---

## 16. Contact

For questions or concerns regarding this Privacy Policy or data protection, please contact us via the contact information provided at: [Contacts](https://bmverse.bruu.eu/contact)
`
export default privacyText
