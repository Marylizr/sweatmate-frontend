import React from 'react';
import NavBar from '../navBar/navBar';
import PoliciesMenu from './PoliciesMenu';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.termsWrapper}>
      <PoliciesMenu />
        <h2 className={styles.title}>SweatMate Terms and Conditions</h2>
        <p className={styles.lastUpdated}>Last revised: January 30, 2025</p>
        <p className={styles.effectiveDate}>Effective date: January 30, 2025</p>

        <div className={styles.termsContent}>
          <h3>1. Introduction</h3>
          <p>
            Welcome to <strong>SweatMate</strong> – the all-in-one <strong>CRM and fitness management platform</strong> 
            designed for personal trainers and their clients. SweatMate offers tools for scheduling, workout planning, 
            nutrition tracking, session history, client progress tracking, and communication, all within an easy-to-use dashboard.
          </p>
          <p>By using SweatMate, you agree to comply with the following <strong>Terms and Conditions</strong>. Please read them carefully.</p>

          <h4>1.1 Eligibility</h4>
          <p>To use SweatMate, you must be at least <strong>18 years old</strong> or <strong>13 years old with parental or guardian consent</strong>.</p>

          <h4>1.2 Modifications</h4>
          <p>We reserve the right to update these Terms at any time. If changes occur, we will notify you via the platform. Continued use of SweatMate after changes means you accept the revised Terms.</p>

          <h4>1.3 Third-Party Services</h4>
          <p>SweatMate integrates with <strong>third-party services</strong> such as payment gateways, AI-driven insights, and video conferencing tools. These services have their own terms, and we are not responsible for their policies.</p>

          <h3>2. Platform License and Use</h3>
          <h4>2.1 License</h4>
          <p>SweatMate grants you a <strong>non-exclusive, non-transferable, revocable</strong> license to access and use our platform solely for personal training and fitness management.</p>

          <h4>2.2 Acceptable Use</h4>
          <ul>
            <li>Use the platform <strong>only for its intended purpose</strong>.</li>
            <li>Keep your account credentials <strong>secure</strong>.</li>
            <li>Ensure all information you provide is <strong>accurate and up-to-date</strong>.</li>
          </ul>
          <p><strong>You may not:</strong></p>
          <ul>
            <li>Modify, copy, distribute, or create derivative works from SweatMate.</li>
            <li>Use SweatMate for <strong>illegal activities, harassment, or harmful content</strong>.</li>
            <li>Share login credentials with unauthorized users.</li>
          </ul>

          <h3>3. Features & Functionalities</h3>
          <h4>3.1 Personal Trainer Dashboard</h4>
          <ul>
            <li>Schedule and manage client bookings.</li>
            <li>Track client progress, workout history, and session completion.</li>
            <li>Customize nutrition and workout plans.</li>
            <li>Send reminders and notifications.</li>
          </ul>

          <h4>3.2 Client Dashboard</h4>
          <ul>
            <li>View upcoming and completed workouts.</li>
            <li>Track fitness progress over time.</li>
            <li>Communicate with trainers directly.</li>
            <li>Receive personalized recommendations.</li>
          </ul>

          <h3>4. Data Storage & Privacy</h3>
          <h4>4.1 User Data Protection</h4>
          <p>We prioritize your <strong>privacy and data security</strong>. All user data is encrypted and stored securely.</p>

          <h4>4.2 Personal Information Usage</h4>
          <p>We collect and use personal information to:</p>
          <ul>
            <li>Provide <strong>customized workout plans</strong>.</li>
            <li>Store <strong>training session history</strong>.</li>
            <li>Improve platform <strong>recommendations and AI insights</strong>.</li>
          </ul>

          <h3>5. Cancellations & Refunds</h3>
          <h4>5.1 Subscription Cancellations</h4>
          <p>You may cancel your subscription anytime via the <strong>Settings</strong> page. Cancellations take effect at the end of the billing cycle.</p>

          <h4>5.2 Refund Policy</h4>
          <p>Refunds are processed on a <strong>case-by-case basis</strong>. Subscription fees are <strong>non-refundable</strong> unless due to technical errors.</p>

          <h3>6. Intellectual Property</h3>
          <p>All software, content, and materials on SweatMate <strong>belong to us</strong>. You retain rights over <strong>your own uploaded content</strong> (e.g., workout plans, client data).</p>

          <h3>7. Limitation of Liability</h3>
          <p>SweatMate provides fitness <strong>recommendations</strong> but is <strong>not a medical service</strong>. Always consult a healthcare professional before starting new fitness routines.</p>

          <h3>8. Contact Information</h3>
          <p>For questions or support, contact us at <a href="mailto:support@sweatmate.io">support@sweatmate.io</a>.</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton}>I Agree</button>
          <button className={styles.declineButton}>I Disagree</button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
