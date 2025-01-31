import React from 'react';
import NavBar from '../navBar/navBar';
import PoliciesMenu from './PoliciesMenu';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.policyWrapper}>
      <PoliciesMenu />
        <h2 className={styles.title}>SweatMate Privacy & Cookie Policy</h2>
        <p className={styles.lastUpdated}><strong>Last revised:</strong> January 30, 2025</p>
        <p className={styles.effectiveDate}><strong>Effective date:</strong> January 30, 2025</p>

        <div className={styles.policyContent}>
          <h3>1. Introduction</h3>
          <p>Welcome to <strong>SweatMate</strong>! Your privacy is important to us. This Privacy & Cookies Policy explains how we collect, use, and protect your personal data when using our platform.</p>
          <p>By using SweatMate, you agree to this policy and our <strong>Terms and Conditions</strong>.</p>

          <h3>2. Data Collection & Usage</h3>
          <h4>2.1 Information We Collect</h4>
          <ul>
            <li><strong>Account Information:</strong> Name, email, phone number (optional), and password.</li>
            <li><strong>Fitness Data:</strong> Workouts, progress tracking, health metrics, mood logs.</li>
            <li><strong>Payment Information:</strong> Processed via third-party gateways (Stripe, PayPal). SweatMate does not store payment details.</li>
            <li><strong>Device & Usage Data:</strong> Browser type, device information, IP address, and activity logs.</li>
          </ul>

          <h4>2.2 How We Use Your Data</h4>
          <ul>
            <li>To provide and improve SweatMate’s features.</li>
            <li>To personalize workouts and nutrition recommendations.</li>
            <li>To ensure security and prevent fraud.</li>
            <li>To communicate important updates.</li>
          </ul>

          <h3>3. Cookies & Tracking</h3>
          <h4>3.1 What Are Cookies?</h4>
          <p>Cookies are small text files stored on your device to enhance your experience.</p>

          <h4>3.2 Types of Cookies We Use</h4>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for login and security.</li>
            <li><strong>Analytics Cookies:</strong> Helps us track usage (Google Analytics, Mixpanel).</li>
            <li><strong>Functionality Cookies:</strong> Saves preferences (theme, language).</li>
            <li><strong>Advertising Cookies:</strong> Used for targeted ads (if applicable).</li>
          </ul>

          <h4>3.3 Managing Cookies</h4>
          <p>You can disable cookies in your browser settings, but some features may not function properly.</p>

          <h3>4. Third-Party Services</h3>
          <p>SweatMate integrates with third-party tools for payments, video calls, and analytics. These services have their own privacy policies.</p>

          <h3>5. Data Security</h3>
          <p>We use encryption and secure servers to protect your information. However, no system is 100% secure, so we encourage strong passwords and careful data sharing.</p>

          <h3>6. User Rights</h3>
          <ul>
            <li><strong>Access:</strong> Request a copy of your data.</li>
            <li><strong>Correction:</strong> Update inaccurate information.</li>
            <li><strong>Deletion:</strong> Request data removal (subject to legal requirements).</li>
            <li><strong>Opt-Out:</strong> Disable marketing emails.</li>
          </ul>

          <h3>7. Data Retention</h3>
          <p>We retain user data for as long as necessary to provide our services. You may request deletion at any time.</p>

          <h3>8. Children’s Privacy</h3>
          <p>SweatMate is not intended for users under 13. Users between 13-18 require parental consent.</p>

          <h3>9. International Data Transfers</h3>
          <p>If you access SweatMate outside the EU, your data may be transferred securely to our servers in compliance with data protection laws.</p>

          <h3>10. Updates to this Policy</h3>
          <p>We may update this policy periodically. Users will be notified of major changes.</p>

          <h3>11. Contact Us</h3>
          <p>For any questions or data requests, contact us at <a href="pixelTrendStudio@gmail.com">pixelTrendStudio@gmail.com</a>.</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton}>I Accept</button>
          <button className={styles.declineButton}>I Decline</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
